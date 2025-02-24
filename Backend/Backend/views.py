from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import json
from .FakeShell import FakeShell
from .IpAdress import IpAdress
from .Location import Location
from .Weather import Weather
from .OpenWeather import OpenWeather
from .OpenWeather2 import OpenWeather2
@csrf_exempt
def get_ip_address(request):
    ip_adress = IpAdress()
    response = ip_adress.get_ip_address()
    return JsonResponse({'result': response})
@csrf_exempt
def get_location(request):
    location = Location()
    response = location.get_location_by_ip()
    # return response
    return JsonResponse(response)
    # return JsonResponse({'result': response})
@csrf_exempt
def get_weather(request):
    weather = Weather()
    response = weather.get_weather()
    return JsonResponse({'result': response})
# @csrf_exempt
# def get_open_weather(request):
#     open_weather = OpenWeather()
#     # response = open_weather.get_current_time()
#     response = open_weather.get_current_weather()
#     return JsonResponse({'result': response})


@csrf_exempt
def get_open_weather(request):
    """ Récupère et renvoie les données météorologiques sous forme de JSON. """
    try:
        open_weather = OpenWeather()
        weather_data = open_weather.get_current_weather()

        if not weather_data:
            return JsonResponse({'error': 'Impossible de récupérer les données météo'}, status=500)

        return JsonResponse({'result': weather_data})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_open_weather2(request):
    """ Récupère et renvoie les données météorologiques sous forme de JSON. """
    try:
        open_weather = OpenWeather2()
        weather_data = open_weather.get_current_weather()

        if not weather_data:
            return JsonResponse({'error': 'Impossible de récupérer les données météo'}, status=500)

        return JsonResponse({'result': weather_data})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def execute_command(request):#Fonction qui permet d'exécuter une commande dans le shell
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            command = body.get('command')
            current_directory = body.get('directory')
            userid = body.get('userid')
            print("current_directory:", current_directory)
            print("Received command:", command)
            command=command.lower()
            shell = FakeShell()
            result= shell.interpreter(command,current_directory,userid)
            directory = shell.current_directory
            if(type(result)==tuple):#Si c'est un CD, on récupère le résultat et le nouveau répertoire courant
                directory=result[1]
                result=result[0]

            # Récupérer l'adresse IP de l'utilisateur
            user_ip = request.META.get('REMOTE_ADDR')
            
            print("Command result:", result)
            # return JsonResponse({'result': result, 'directory': directory})
            return JsonResponse({'result': result, 'directory': directory, 'user_ip': user_ip})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'result': str(e)})
    return JsonResponse({'result': 'Invalid request method'})
@csrf_exempt
def get_last_command(request):#Fonction qui permet de récupérer la dernière commande exécutée dans le shell
    if request.method == 'GET':
        shell = FakeShell()
        response=shell.last_command()
        print(response)
        return JsonResponse({'result': response})
    return JsonResponse({'result': 'Invalid request method'})

