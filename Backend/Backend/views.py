from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import json
from .FakeShell import FakeShell
@csrf_exempt
def execute_command(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            command = body.get('command')
            print("Received command:", command)
            command=command.lower()
            shell = FakeShell()
            result= shell.interpreter(command)
            print("Command result:", result)
            return JsonResponse({'result': result})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'result': str(e)})
    return JsonResponse({'result': 'Invalid request method'})
@csrf_exempt
def get_last_command(request):
    if request.method == 'GET':
        shell = FakeShell()
        response=shell.last_command()
        print(response)
        return JsonResponse({'result': response})
    return JsonResponse({'result': 'Invalid request method'})