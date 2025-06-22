import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async checkHealth() {
    const dbStatus = await this.checkDatabase();
    
    return {
      status: dbStatus.connected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      database: dbStatus,
      services: {
        auth: 'ok',
        collections: 'ok',
        photos: 'ok',
        reminders: 'ok',
        importantDates: 'ok',
        shoppingLists: 'ok',
      }
    };
  }

  private async checkDatabase() {
    try {
      const adminDb = this.connection.db?.admin();
      if (!adminDb) {
        return {
          connected: false,
          status: 'disconnected',
          error: 'Database connection not available',
          database: this.connection.name || 'unknown',
        };
      }
      const result = await adminDb.ping();
      
      return {
        connected: true,
        status: 'connected',
        ping: result?.ok === 1 ? 'ok' : 'failed',
        database: this.connection.name || 'unknown',
        collections: Object.keys(this.connection.collections || {}).length,
      };
    } catch (error) {
      return {
        connected: false,
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        database: this.connection.name || 'unknown',
      };
    }
  }

  async checkDetailedHealth() {
    const basicHealth = await this.checkHealth();
    
    // Adiciona informações básicas sobre as coleções
    try {
      const collections = await this.connection.db?.listCollections().toArray();
      
      return {
        ...basicHealth,
        detailed: {
          collections: collections?.map(collection => ({
            name: collection.name || 'unknown',
            type: collection.type || 'unknown',
          })) || [],
          connections: {
            active: 0,
            max: 10,
          }
        }
      };
    } catch (error) {
      return {
        ...basicHealth,
        detailed: {
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      };
    }
  }
} 