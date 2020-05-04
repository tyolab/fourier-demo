


mq.factory.host = "localhost";

var producer;
var consumer;

var canvas;

function updateProducerStatus(connected) {
    var elem = document.getElementById('producer-status');
    updateConnectionStatus(elem, connected);
}

function updateConsumerStatus(connected) {
    var elem = document.getElementById('consumer-status');
    updateConnectionStatus(elem, connected);
}

function updateConnectionStatusById(connected, id) {
    var elem = document.getElementById(id);
    updateConnectionStatus(elem, connected);
}

function updateConnectionStatus(elem, connected) {
    if (!elem)
        return;

    if (connected) {
        elem.innerHTML = "Connected to MQ Server";
    }
    else {
        elem.innerHTML = "Disconnected";
    }
}

function drawPixel (canvasData, x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;

    if (a)
        canvasData.data[index + 3] = a;
}

function drawImageWithArray(array) {
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext("2d");
    var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    for (var y = 0; y < array.length; y++) {
        var width = array[y].length;

        for (var x = 0; x < width; x++) {

            for (var i = 0; i < 8; ++i) {
                for (var j = 0; j < 8; ++j) {
                    var realX, realY;
                    
                }
            }

            array[y][x] = imageH8;
        }
    }

    ctx.putImageData(canvasData, 0, 0);
}

function updateMessageFromPublisher(message) {
    console.debug("Message received: " + message);

    if (message.array) {
        drawImageWithArray(message.array);
    }
    // var elem = document.getElementById('message-received');
    // elem.innerHTML = message;
}

function publish() {
    var message = document.getElementById('message-to-send').value;
    var type = document.getElementById('message-type-producer').value;
    producer.produce(type, message);
}

function onConnect(entity, id) {
    updateConnectionStatusById(true, id);

    entity.on('disconnect', function ()  {
        updateConnectionStatusById(false, id);
    });
}

function connect(entity, id) {
    if (entity) {
        entity.disconnect();
        entity.connect(function ()  {
                    onConnect(entity, id);
                },
            mq.factory.port,
            mq.factory.host);
    }
}

function disableSomething(socket) {
    // You can't do it here
    // socket.disable('browser client cache');
    // socket.disable('heartbeats');
}

function connectProducerToServer() {
    if (producer) {
        disableSomething(producer);

        connect(producer);
    }
    else {
        var publishType = document.getElementById('message-type-producer').value;
        mq.factory.createProducer(publishType, function (p) {
            producer = p;
            disableSomething(producer);

            onConnect(producer, 'producer-status');
        });
    }
}

function connectConsumerToServer() {
    if (consumer) {
        disableSomething(consumer);

        connect(consumer);

        updateSubscription();
    }
    else {
        var subscribeType = "magic-watcher"; // document.getElementById('message-type-consumer').value;
        mq.factory.createConsumer(subscribeType, function (c) {
            consumer = c;
            disableSomething(consumer);

            onConnect(consumer, 'consumer-status');

            updateSubscription();
        });
    }
}

function updateMQServer() {
    //mq.factory.host = document.getElementById('server').value;

    //connectProducerToServer();
    connectConsumerToServer();
}

function updateSubscription() {
    var subscribeType = "image"; // document.getElementById('message-type-consumer').value;
    if (consumer) {
        if (!consumer.connected)
            connectConsumerToServer();

        consumer.subscribe("fourier-magic", subscribeType, function (message) {
            updateMessageFromPublisher(message);
        });
    }
}

$( document ).ready(function() {
    console.log( "ready!" );

    canvas = document.querySelector("canvas");

    connectConsumerToServer();

});


