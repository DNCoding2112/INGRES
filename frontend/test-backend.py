import requests
import time
import sys

def test_backend():
    """Test if the backend API is working"""
    base_url = "http://127.0.0.1:8000"
    
    print("Testing INGRES RAG API Backend...")
    print("=" * 40)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running")
        else:
            print("❌ Backend server responded with error")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend server: {e}")
        print("Make sure the backend is running on http://127.0.0.1:8000")
        return False
    
    # Test 2: Test the ask endpoint
    try:
        test_query = "What is groundwater?"
        response = requests.get(f"{base_url}/ask?query={test_query}", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if "answer" in data:
                print("✅ Ask endpoint is working")
                print(f"Sample response: {data['answer'][:100]}...")
            else:
                print("❌ Ask endpoint returned unexpected format")
                return False
        else:
            print(f"❌ Ask endpoint failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Ask endpoint test failed: {e}")
        return False
    
    print("\n🎉 All tests passed! Backend is working correctly.")
    return True

if __name__ == "__main__":
    success = test_backend()
    sys.exit(0 if success else 1)
