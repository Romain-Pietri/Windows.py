import requests

class IpAdress():
    def __init__(self):
        self.ip_address = None
        self.error = None

    def fetch_ip_address(self):
        try:
            response = requests.get('https://api.ipify.org?format=json')
            response.raise_for_status()  # Raise an exception for HTTP errors
            self.ip_address = response.json().get('ip')
        except requests.exceptions.HTTPError as http_err:
            self.error = f"HTTP error occurred: {http_err}"
        except requests.exceptions.RequestException as req_err:
            self.error = f"Request error occurred: {req_err}"
        except Exception as err:
            self.error = f"An error occurred: {err}"
        print("IP address :\n" , self.ip_address, "\n\n")

    def get_ip_address(self):
        self.fetch_ip_address()
        if self.error:
            return f"Erreur: {self.error}"
        return f"{self.ip_address}"

