import redis

redis_host = 'localhost'  # Replace with your Redis server's host
redis_port = 6379        # Replace with your Redis server's port
channel_name = 'model_arch_path'  # Replace with your channel name

# Connect to Redis
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

# Subscribe to the channel
pubsub = redis_client.pubsub()
pubsub.subscribe(channel_name)

# Start listening for messages
for message in pubsub.listen():
    if message['type'] == 'message':
        print(message)