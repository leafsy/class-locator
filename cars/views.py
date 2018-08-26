from django.shortcuts import render
from django.http import JsonResponse
from bs4 import BeautifulSoup, SoupStrainer
import requests

def index(request):
  index = 0
  rows_per_page = 120
  data = []
  strainer = SoupStrainer("ul", class_="rows")
  while True:
    url = "https://raleigh.craigslist.org/search/cta?s={}".format(index)
    resp = requests.get(url)
    soup = BeautifulSoup(resp.content, "lxml", parse_only=strainer)
    rows = soup.find_all("li", class_="result-row")
    if len(rows) == 0:
      break;
    data.extend(list(map(lambda row : buildDataFromRow(row), rows)))
    index += rows_per_page
  return JsonResponse(data, safe=False)

def buildDataFromRow(row):
  title = row.find("a", "result-title")
  date = row.find("time", "result-date")
  price = row.find("span", "result-price")
  return {
    "title": title.get_text() if title else None,
    "link": title.get("href") if title else None,
    "date": date.get("datetime") if date else None,
    "price": price.get_text() if price else None,
  }
