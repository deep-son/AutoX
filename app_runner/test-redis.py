import redis 
import time
import json

redis_host = 'localhost'
redis_port = 6379
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

counter = 0
channel_name = 'model_arch_path'

while True:
    redis_client.publish(channel_name, counter)
    print(f"published {counter}")
    counter = counter + 1
    time.sleep(3)
