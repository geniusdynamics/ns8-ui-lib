export interface GetStatus {
  error: string;
  exit_code: number;
  file: string;
  output: Output;
}

export interface StatusOutput {
  images: Image[];
  instance: string;
  node: string;
  node_ui_name: string;
  services: Service[];
  ui_name: string;
  volumes: Volume[];
}

export interface Image {
  created: string;
  name: string;
  size: string;
}

export interface Service {
  active: boolean;
  enabled: boolean;
  failed: boolean;
  name: string;
}

export interface Volume {
  created: string;
  mount: string;
  name: string;
}
