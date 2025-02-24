from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import json
from .FakeShell import FakeShell
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