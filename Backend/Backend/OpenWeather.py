import requests
import requests_cache
import json  # Import du module json
from .Location import Location

class OpenWeather:
    def __init__(self, latitude=50.7136, longitude=3):
        self.latitude = latitude
        self.longitude = longitude
        self.session = self._setup_requests_cache()

    def _setup_requests_cache(self):
        """ Configure un cache pour éviter de surcharger l'API """
        return requests_cache.CachedSession('.cache', expire_after=3600)

    def get_current_weather(self):
        """ Récupère la météo actuelle en fonction de l'emplacement de l'utilisateur """
        try:
            # Récupérer la position de l'utilisateur via une API d'IP
            location_response = Location().get_location_by_ip()
            location_data = json.loads(location_response.content.decode('utf-8'))
            self.latitude = location_data["result"]["latitude"]
            self.longitude = location_data["result"]["longitude"]

            # Construire l'URL de requête Open-Meteo
            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                "latitude": self.latitude,
                "longitude": self.longitude,
                "hourly": ["temperature_2m", "wind_speed_10m"],
                "timezone": "auto"  # Auto pour détecter le bon fuseau horaire
            }

            # Envoyer la requête API
            response = self.session.get(url, params=params)

            # Vérifier si la requête a réussi
            if response.status_code != 200:
                print("Erreur API:", response.status_code, response.text)
                return None

            # Convertir la réponse JSON
            weather_data = response.json()

            # Retourner les données structurées
            return {
                "latitude": weather_data["latitude"],
                "longitude": weather_data["longitude"],
                "elevation": weather_data["elevation"],
                "timezone": weather_data["timezone"],
                "timezone_abbreviation": weather_data["timezone_abbreviation"],
                "utc_offset_seconds": weather_data["utc_offset_seconds"],
                "hourly": {
                    "time": weather_data["hourly"]["time"],
                    "temperature_2m": weather_data["hourly"]["temperature_2m"],
                    "wind_speed_10m": weather_data["hourly"]["wind_speed_10m"]
                },
                "hourly_units": {
                    "temperature_2m": weather_data["hourly_units"]["temperature_2m"]
                }
            }

        except Exception as e:
            print("Erreur lors de la récupération des données météo:", str(e))
            return None
