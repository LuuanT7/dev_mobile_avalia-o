import amqp, { Connection, Channel } from 'amqplib';

export class RabbitMQService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly url: string;

    constructor() {
        this.url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
    }

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(this.url);
            this.channel = await this.connection.createChannel();
            console.log('✅ Conectado ao RabbitMQ');
        } catch (error) {
            console.error('❌ Erro ao conectar ao RabbitMQ:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }

    async assertQueue(queueName: string): Promise<void> {
        if (!this.channel) {
            await this.connect();
        }
        await this.channel!.assertQueue(queueName, { durable: true });
    }

    async publishMessage(queueName: string, message: any): Promise<void> {
        if (!this.channel) {
            await this.connect();
        }
        await this.assertQueue(queueName);
        this.channel!.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }

    async consumeMessages(
        queueName: string,
        callback: (message: any) => void
    ): Promise<void> {
        if (!this.channel) {
            await this.connect();
        }
        await this.assertQueue(queueName);
        await this.channel!.consume(queueName, (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                callback(content);
                this.channel!.ack(msg);
            }
        });
    }

    getChannel(): Channel | null {
        return this.channel;
    }
}

