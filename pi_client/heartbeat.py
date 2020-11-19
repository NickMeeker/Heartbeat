import argparse, time, requests

port = '30000'
url = 'http://localhost'

def login_and_return_token(args):
  login_body = {
    'username': args.username,
    'password': args.password
  }
  login_url = url + ':' + port + '/login'
  r = requests.post(url=login_url, data = login_body)
  res = r.json()
  return res['token']

def ping_heartbeat_and_return_response(args, token):
  ping_heartbeat_url = url + ':' + port + '/heartbeat/ping/' + args.username
  ping_heartbeat_headers = {
    'x-access-token': token,
  }
  r = requests.patch(url=ping_heartbeat_url, headers=ping_heartbeat_headers)
  return r

def main(args):
  # login
  startTime = time.time()
  token = ''
  while True:
    r = ping_heartbeat_and_return_response(args, token)
    if(r.status_code == 403):
      token = login_and_return_token(args)
      ping_heartbeat_and_return_response(args, token)
    time.sleep(5 * 60.0)
  


parser = argparse.ArgumentParser(description='Heartbeat client.')
parser.add_argument('--username', metavar='U', help='username for this client')
parser.add_argument('--password', metavar='P', help='password for this client')
main(parser.parse_args())