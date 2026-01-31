import { Injectable } from '@angular/core';

export interface AppConfig {
  env: { 
    url: string 
  };
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig | null = null;

  setConfig(config: AppConfig) {
    this.config = config;
  }
  
  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error("Config not loaded");
    }
    return this.config;
  }
}
