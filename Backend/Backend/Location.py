import requests
from .IpAdress import IpAdress
import json
from django.http import JsonResponse

class Location():
    def __init__(self):
        self.location = None
        self.error = None

    def fetch_location(self):
        try:
            ip_address = IpAdress().get_ip_address()
            response = requests.get(f"https://ipinfo.io/{ip_address}/json")
            response.raise_for_status()  # Raise an exception for HTTP errors
            self.location = response.json()
        except requests.exceptions.HTTPError as http_err:
            self.error = f"HTTP error occurred: {http_err}"
        except requests.exceptions.RequestException as req_err:
            self.error = f"Request error occurred: {req_err}"
        except Exception as err:
            self.error = f"An error occurred: {err}"
        print("Location :\n", self.location, "\n\n")

    
    def get_location_by_ip(self):
        self.fetch_location()
        if self.error:
            return f"Erreur: {self.error}"
        else:
            coord = self.location.get("loc")
            latitude, longitude = coord.split(",")
            data = {"latitude": float(latitude), "longitude": float(longitude)}
            print("coord : ", data)
            print("lat : ", data["latitude"])
            # return f"{data}"
            return JsonResponse({'result': data})
            # return data

        


