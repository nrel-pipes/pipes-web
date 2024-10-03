import os
import boto3
from typing import Optional
from dotenv import load_dotenv
from pathlib import Path
from auth import get_cognito_access_token
import requests
load_dotenv()

URL_MAP = {
    "dev": "http://localhost:8080/",
    "stage": "",
    "prod": ""
}
URL = "http://localhost:8080/"

class Client:
    def __init__(self, username, password, project=None, projectrun=None, model=None, modelrun=None, datasets=None, teams=None):
        """
        Object is to establish pipes connection with api. 
        Logic: 1) get token, 2) declares URL of the API server
        """
        self.token = get_cognito_access_token(username, password)
        self.project = project
        self.projectrun = projectrun
        self.model = model
        self.modelrun = modelrun
        self.datasets = datasets
        self.teams = teams

    def get(self, extension, **queries):
        """
        Does get requests for our given api and 
        url to get
        """
        url = URL 
        if len(queries) > 0:
            url = f"{url}{extension}/?"
        for query in queries:
            url = f"{url}{query}={queries[query]}{'&' if query != list(queries.keys())[-1] else ''}"
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(url=url, headers=headers)
        return response

    def post(self, data, extension, **queries):
        url = URL
        if len(queries) > 0:
            url = f"{url}{extension}/?"
        for query in queries:
            url = f"{url}{query}={queries[query]}{'&' if query != list(queries.keys())[-1] else ''}"
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(url=url, data=data, headers=headers)
        return response
    
    def check_connection(self):
        response = self.get("", **{})
        if response.status_code == 200:
            return "Connection established"
        return "Connection failed"

    def get_projects(self, project=None):
        self.project = project
        return self.get("api/projects", **{"project": project}).json()

    def post_project(self, project, file):
        """
        Wraps post project method from the api. 
        -> Set help to True in order to learn how to provide a TOML file.  
        """
        pass
        
    def project_help(self):
        pass

    def get_projectruns(self, project=None):
        if project is not None:
            self.project = project
        if not project:
            raise ValueError("Please provide a project and projectrun")
        return self.get("api/projectruns", **{"project": project}).json()
    
    def get_models(self, project=None, projectrun=None):
        if project is not None:
            self.project = project
        if projectrun is not None:
            self.projectrun = projectrun
        if not project or not projectrun:
            raise ValueError("Please provide a project and projectrun")
        return self.get("api/models", **{"project": project, "projectrun": projectrun}).json()

    def get_modelruns(self, project, projectrun, model):
        if project is not None:
            self.project = project
        if projectrun is not None:
            self.projectrun = projectrun
        if model is not None: 
            self.model = model
        if not project or not projectrun or not model:
            raise ValueError("Please provide a project, projectrun, and model")
        return self.get("api/modelruns", **{"project": project, "projectrun": projectrun, "model": model}).json()
    
    def get_datasets(self, project=None, projectrun=None, model=None, modelrun=None):
        if project is not None:
            self.project = project
        if projectrun is not None:
            self.projectrun = projectrun
        if model is not None:
            self.model = model
        if modelrun is not None:
            self.modelrun = modelrun
        if not project or not projectrun or not model or not modelrun:
            raise ValueError("Please provide a project, projectrun, model, and modelrun")
        return self.get("api/datasets", **{"project": project, "projectrun": projectrun, "model": model, "modelrun": modelrun}).json()

    def get_teams(self, project=None):
        if project is not None:
            self.project = project
        if not project:
            raise ValueError("Please provide a project")
        return self.get("api/teams", **{"project": project}).json()

    def get_users(self):
        return self.get("api/users").json()


    

if __name__=="__main__":
    username = os.environ.get("USERNAME")
    password = os.environ.get("PASSWORD")
    client = Client(username, password)
    # print(client.check_connection())
    # print(client.get_projects("test1"))
    # print(client.get_projectruns("test1"))
    # print(client.get_models("test1", "1"))
    # print(client.get_modelruns("test1", "1", "dsgrid"))
    # print(client.get_datasets("test1", "1", "dsgrid", "string"))
    # print(client.get_teams("test1"))
    # print(client.get_users())