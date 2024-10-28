# Python script para testar a API (salvar como test_api.py)
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_api():
    # Criar cliente
    customer_data = {
        "name": "Test Customer",
        "celphone": "11977777777",
        "document": "11122233344",
        "email": "test@example.com",
        "address": "Test Street",
        "complement": "Test Complement"
    }
    
    # POST - Criar cliente
    response = requests.post(f'{BASE_URL}/customers/', json=customer_data)
    print("Criar Cliente:", response.status_code)
    if response.status_code == 201:
        customer_id = response.json()['id']
        print("Cliente criado com ID:", customer_id)
        
        # GET - Buscar cliente
        response = requests.get(f'{BASE_URL}/customers/{customer_id}/')
        print("Buscar Cliente:", response.status_code)
        print(json.dumps(response.json(), indent=2))
        
        # PUT - Atualizar cliente
        update_data = customer_data.copy()
        update_data['name'] = "Updated Test Customer"
        response = requests.put(f'{BASE_URL}/customers/{customer_id}/', json=update_data)
        print("Atualizar Cliente:", response.status_code)
        
        # DELETE - Desativar cliente
        response = requests.delete(f'{BASE_URL}/customers/{customer_id}/')
        print("Desativar Cliente:", response.status_code)

if __name__ == '__main__':
    test_api()