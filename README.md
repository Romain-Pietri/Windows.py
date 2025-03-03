# Windows.py

## Description
WINDOWS.PY is a web application that simulates an operating system interface, similar to Windows nor Linux. The application is built using Django for the backend, providing a robust framework for handling requests and managing data.


## Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/my-os-simulator.git
    cd my-os-simulator
    ```

2. Then you can choose automatic installation and setup or to manually setup yourself :

## Automatic Installation and launch :

To automatically install dependencies and launch the application, you can use the provided `launch.py` script. This script will set up the virtual environment, install the required packages, and start both the backend and frontend servers.

Run the following command:
```
python launch.py
```

To stop the development server, press `Ctrl+C` in the terminal where you excuted launch.py



## Manual Installation

### Frontend Setup

To set up the frontend, follow these steps:

1. Navigate to the Frontend directory:
    ```
    cd Frontend
    ```

2. Install the dependencies:
    ```
    npm install
    ```

3. Start the development server:
    ```
    npm start
    ```

4. Open your browser and go to `http://localhost:3000` to view the frontend application.


### Backend Setup

1. Navigate to the Backend directory:
    ```
    cd Backend
    ```
2. Create a virtual environment:
    ```
    python -m venv venv

    ```
3. Activate the virtual environment:
    ```
    . venv/Scripts/activate (Windows)
    source venv/bin/activate (Linux)
    ```

4. Install the required packages:
    ```
    pip install -r requirements.txt
    ```

5. Start the development server:
    ```
    python manage.py runserver
    ```



## Contributing

[ALixeM](https://github.com/AlixeM)
[Romain-Pietri](https://github.com/Romain-Pietri)
[SErvaLJaycE](https://github.com/ServaLJaycE)
[BaptisteLibert](https://github.com/BaptisteLibert)
