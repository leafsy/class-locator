from django.shortcuts import render
from django.http import JsonResponse, Http404
import requests
import json

def index(request):
  key = request.GET.get('link', '')
  resp = requests.get('https://classes.cornell.edu/api/3.0/public/shared-schedule/' + key)
  if resp.status_code != requests.codes.ok:
    raise Http404("Schedule does not exist")

  courses = resp.json()['courses']
  term = resp.json()['slug']
  payload = { 'crsePairs': courses_to_idstr(courses), 'roster': term }
  resp = requests.post('https://classes.cornell.edu/api/3.0/public/course-detail', json=payload)
  details = resp.json()

  with open('classlocator/locations.json') as f:
    locations = json.load(f)

  return JsonResponse(flatten_details(details, courses, locations), safe=False)

def courses_to_idstr(courses):
  return [str(c['crseId']) + ',' + str(c['crseOfferNbr']) for c in courses if c['enabled']]

def flatten_details(details, courses, locations):
  return [
    {
      'course': c['subject'] + ' ' + c['catalogNbr'],
      'name': c['titleLong'],
      'section': s['ssrComponent'] + ' ' + s['section'],
      'schedule': m['sun'] + m['mon'] + m['tues'] + m['wed'] + m['thurs'] + m['fri'] + m['sat'],
      'startDate': m['startDt'],
      'endDate': m['endDt'],
      'startTime': m['timeStart'],
      'endTime': m['timeEnd'],
      'latlng': bldg_to_latlng(m['bldgDescr'], locations),
      'room': m['facilityDescr'],
      'color': color_of_course(c, courses),
    }
    for c in details
    for e in c['enrollGroups']
    for s in e['classSections'] if class_is_pinned(s['classNbr'], courses)
    for m in s['meetings']
  ]

def class_is_pinned(classNbr, courses):
  return classNbr in [n for c in courses for n in c['pinnedClassNbrs']]

def color_of_course(course, courses):
  return next((c['color'] for c in courses if c['crseId'] == course['crseId']), None)

def bldg_to_latlng(bldg, locations):
  return next(([float(x['Lat']), float(x['Lng'])] for x in locations if x['Name'] == bldg), None)