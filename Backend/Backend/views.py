from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import json
from .FakeShell import FakeShell
from .WhatApps import WhatApps
from .Maigret import *
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
            
            print("Command result:", result)
            return JsonResponse({'result': result, 'directory': directory})
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
@csrf_exempt
def send_message(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        print("Received message:", body)
        user1 = body.get('user1')
        user2 = body.get('user2')
        message = body.get('message')
        whosend = body.get('whosend')
        whatapps = WhatApps()
        whatapps.insert(user1, user2, message, whosend)
        return JsonResponse({'result': 'Message sent'})
    return JsonResponse({'result': 'Invalid request method'})
@csrf_exempt
def get_message(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user1 = body.get('user1')
        user2 = body.get('user2')
        whatapps = WhatApps()
        messages = whatapps.get(user1, user2)
        return JsonResponse({'result': messages})
    return JsonResponse({'result': 'Invalid request method'})
@csrf_exempt
def get_conversation(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user1 = body.get('user1')
        whatapps = WhatApps()
        conversations = whatapps.getConversation(user1)
        return JsonResponse({'result': conversations})
    return JsonResponse({'result': 'Invalid request method'})

@csrf_exempt
def get_user(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user = body.get('user')
        username = search_username(user)
        print(username)
        return JsonResponse({'result': list(username)})
    return JsonResponse({'result': 'Invalid request method'})