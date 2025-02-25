from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import json
from .FakeShell import FakeShell
import calendar
from django.http import HttpResponse
import datetime

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
def get_news(request):
    if request.method == 'GET':
        try:
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
