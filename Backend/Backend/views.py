import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import json
from .FakeShell import FakeShell
from .WhatApps import WhatApps
from .Maigret import *
from openai import OpenAI



# Charger la clé OpenAI depuis les variables d'environnement
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

#importer la clé api dans le .env qui se trouve dans le dossier Backend/Backend
import os
from dotenv import load_dotenv
load_dotenv()
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

@csrf_exempt
def chatbot(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            user_message = body.get("message", "")

            if not user_message:
                return JsonResponse({"error": "Message vide"}, status=400)

            # Vérifier si la clé API OpenAI est bien chargée
            if not OPENAI_API_KEY:
                return JsonResponse({"error": "Clé OpenAI manquante"}, status=500)

            # Appel à l'API OpenAI

            # Utilise le bon endpoint pour les modèles de type chat
            response = client.chat.completions.create(model="gpt-3.5-turbo",  # Utilise le modèle correct
            messages=[{"role": "user", "content": user_message}])

            print("OpenAI response:", response)  # Ajoute un print pour inspecter la réponse

            # Extraire la réponse du bot
            bot_reply = response.choices[0].message.content
            return JsonResponse({"reply": bot_reply})

        except KeyError as e:
            return JsonResponse({"error": f"Clé manquante dans la réponse: {str(e)}"}, status=500)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Méthode invalide"}, status=400)


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

@csrf_exempt
def search_youtube(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            query = body.get('query')
            url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q={query}&key={YOUTUBE_API_KEY}'
            response = requests.get(url)
            data = response.json()
            video_ids = [item['id']['videoId'] for item in data['items']]
            return JsonResponse({'video_ids': video_ids})
        except Exception as e:
            return JsonResponse({'error': str(e)})
    return JsonResponse({'error': 'Invalid request method'})