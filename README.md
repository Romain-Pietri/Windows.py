# My OS Simulator

## Description
My OS Simulator is a web application that simulates an operating system interface, similar to Windows. The application is built using Django for the backend, providing a robust framework for handling requests and managing data.

## Project Structure
```
my-os-simulator
├── my_os_simulator
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── manage.py
├── requirements.txt
├── Frontend
│   ├── public
│   │   ├── index.html         # The entry point of the web application.
│   │   └── styles
│   │       └── main.css       # CSS styles for the application.
│   ├── src
│   │   ├── components
│   │   │   └── Desktop.tsx    # React component representing the desktop interface.
│   │   ├── App.tsx            # Main application component that renders the Desktop.
│   │   └── index.tsx          # Entry point for the React application.
│   ├── package.json            # npm configuration file listing dependencies and scripts.
│   ├── tsconfig.json           # TypeScript configuration file specifying compiler options.
│   └── README.md               # Documentation for the frontend project.
```

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/my-os-simulator.git
    cd my-os-simulator
    ```

2. Create a virtual environment:
    ```
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required packages:
    ```
    pip install -r requirements.txt
    ```


## Automatic Installation and launch :

To automatically install dependencies and launch the application, you can use the provided `launch.py` script. This script will set up the virtual environment, install the required packages, and start both the backend and frontend servers.

Run the following command:
```
python launch.py
```

To stop the development server, press `Ctrl+C` in the terminal where you excuted launch.py



## Running the Application

To start the development server, run:
```
python manage.py runserver
```

You can then access the application at `http://127.0.0.1:8000/`.

## Frontend Setup

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

## Contributing

Feel free to submit issues or pull requests for any improvements or features you'd like to see!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.