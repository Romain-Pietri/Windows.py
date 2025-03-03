from django.http import JsonResponse, HttpResponse
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import json
from .FakeShell import FakeShell
import calendar
from django.http import HttpResponse
import datetime

from .IpAdress import IpAdress
from .Location import Location
from .Weather import Weather
from .OpenWeather import OpenWeather
from .OpenWeather2 import OpenWeather2
from .UserManager import UserManager
import sqlite3

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
        print("hello")
        open_weather = OpenWeather2()
        weather_data = open_weather.get_current_weather()
        print("weather_data:", weather_data)
        if not weather_data:
            return JsonResponse({'error': 'Impossible de récupérer les données météo'}, status=500)

        return JsonResponse({'result': weather_data})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')
        user_manager = UserManager()
        try:
            if not(user_manager.add_user(username, password)):
                return JsonResponse({'error': 'Username or password is empty'}, status=400)
            return JsonResponse({'message': 'User registered successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')
        user_manager = UserManager()
        user = user_manager.check_user(username, password)
        
        if user:
            response = {
                'message': 'Login successful',
                'userid': user  
            }
            return JsonResponse(response)
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
    
def create_users_table():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
    ''')
    conn.commit()
    conn.close()

@csrf_exempt
def add_user(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')

        create_users_table()  # Assurez-vous que la table users est créée

        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()

        try:
            cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
            conn.commit()
            response = {'message': f"User {username} added successfully."}
        except sqlite3.IntegrityError:
            response = {'error': f"User {username} already exists."}
        finally:
            conn.close()

        return JsonResponse(response)

    return JsonResponse({'error': 'Invalid request method'})

@csrf_exempt
def verify_user(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')

        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
        user = cursor.fetchone()

        conn.close()

        if user:
            response = {'message': f"User {username} authenticated successfully."}
        else:
            response = {'error': 'Invalid username or password.'}

        return JsonResponse(response)

    return JsonResponse({'error': 'Invalid request method'})

@csrf_exempt
def get_all_users(request):
    if request.method == 'GET':
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()

        cursor.execute('SELECT username FROM users')
        users = cursor.fetchall()

        conn.close()

        user_list = [user[0] for user in users]
        return JsonResponse({'users': user_list})

    return JsonResponse({'error': 'Invalid request method'})


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

@csrf_exempt
def get_news(request):
    print("hllo")
    if request.method == 'GET':
        try:
            
            api_key = os.getenv('REACT_APP_NEWS_API_KEY')
            print(api_key)
            # Utilisation de la clé API depuis le fichier .env
            url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
            response = requests.get(url)
            news_data = response.json()
            return JsonResponse({'articles': news_data.get('articles', [])})
        except requests.exceptions.RequestException as e:
            print(f"Error fetching news: {e}")
            return JsonResponse({'error': 'Erreur lors de la récupération des actualités'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
    
@csrf_exempt
def calendar_view(request):
    now = datetime.datetime.now()
    cal = calendar.HTMLCalendar().formatmonth(now.year, now.month)
    return HttpResponse(f"""
        <html>
        <head>
        <style>
        table {{ border-collapse: collapse; }}
        td, th {{ border: 1px solid black; padding: 5px; }}
        </style>
        </head>
        <body>
        <h2>Calendrier de {now.strftime('%B %Y')}</h2>
        {cal}
        </body>
        </html>
    """)
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

events = []
@csrf_exempt
def calendar_view(request):
    now = datetime.datetime.now()
    cal = calendar.HTMLCalendar().formatmonth(now.year, now.month)

    # Générer l'HTML du calendrier avec les événements colorés
    for event in events:
        event_date = event['date']
        # Ajouter la couleur dans la case du jour
        cal = cal.replace(f'>{event_date}<', f'style="background-color:{event["color"]};">{event_date}<')

    # Sérialiser les événements en JSON pour les passer à JavaScript
    events_json = json.dumps(events)

    # Retourner le HTML avec les événements sérialisés
    return HttpResponse(f"""
        <html>
        <head>
        <style>
        table {{ border-collapse: collapse; }}
        td, th {{ border: 1px solid black; padding: 5px; }}
        .container {{
            display: flex;
            justify-content: space-between;
        }}
        .calendar {{
            width: 60%;
        }}
        .event-form {{
            width: 35%;
            padding: 10px;
            border: 1px solid black;
        }}
        .event-list {{
            margin-top: 20px;
        }}
        .event-item {{
            padding: 8px;
            margin-bottom: 10px;
            border-radius: 5px;
            color: black;
        }}
        </style>
        </head>
        <body>
        <div class="container">
            <div class="calendar">
                <h2>Calendrier de {now.strftime('%B %Y')}</h2>
                {cal}
            </div>
            <div class="event-form">
                <h3>Ajouter un événement</h3>
                <form id="eventForm">
                    <label>Nom de l'événement:</label><br>
                    <input type="text" id="eventName" required><br><br>
                    <label>Heure:</label><br>
                    <input type="time" id="eventTime" required><br><br>
                    <label>Description:</label><br>
                    <textarea id="eventDesc" required></textarea><br><br>
                    <label>Date:</label><br>
                    <input type="date" id="eventDate" required><br><br>
                    <label>Couleur:</label><br>
                    <input type="color" id="eventColor" value="#ff0000"><br><br>
                    <button type="button" onclick="addEvent()">Ajouter</button>
                </form>
                <div class="event-list" id="eventList">
                    <h4>Liste des événements:</h4>
                    <ul id="eventListItems">
                    </ul>
                </div>
            </div>
        </div>

        <script>
        // Passer les événements sérialisés depuis Python à JavaScript
        let events = {events_json}; // Remplacer {events_json} par les événements sérialisés
        
        function addEvent() {{
            const name = document.getElementById('eventName').value;
            const time = document.getElementById('eventTime').value;
            const description = document.getElementById('eventDesc').value;
            const color = document.getElementById('eventColor').value;
            const date = document.getElementById('eventDate').value;

            // Vérifier si la date est valide
            if (!date) {{
                alert('Veuillez sélectionner une date valide.');
                return;
            }}

            // Ajouter un événement en mémoire
            const event = {{
                name: name,
                time: time,
                description: description,
                color: color,
                date: date, // Utiliser la date choisie par l'utilisateur
            }};

            events.push(event); // Ajouter l'événement à la liste d'événements

            // Afficher l'événement dans la liste
            const eventListItems = document.getElementById('eventListItems');
            const li = document.createElement('li');
            li.classList.add('event-item');
            li.style.backgroundColor = color + '33'; // Appliquer une couleur pastel (transparente)
            li.textContent = name + ' - ' + time + ' - ' + description + ' - ' + new Date(date).toLocaleDateString();
            eventListItems.appendChild(li);

            // Ajouter la couleur à la case du calendrier en fonction de la date sélectionnée
            const calendarCells = document.querySelectorAll('td');
            calendarCells.forEach(cell => {{
                if (cell.textContent === new Date(event.date).getDate().toString()) {{
                    cell.style.backgroundColor = event.color;
                }}
            }});

            // Réinitialiser le formulaire
            document.getElementById('eventForm').reset();
        }}
        </script>
        </body>
        </html>
    """)

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