# AWS Secure Infrastructure ☁️
 
Laboratorio personal para aprender **Cloud Engineering, DevOps y DevSecOps** construyendo una infraestructura real en AWS, paso a paso y con prácticas cercanas a un entorno profesional.
 
> ⚠️ **Esto es un laboratorio, no producción.** El objetivo es aprender, documentar y poder explicar cada decisión.
 
---
 
## 🎯 Objetivo
 
Quiero demostrar experiencia práctica en:
 
- Diseñar y gestionar infraestructura como código con **Terraform**.
- Entender de verdad la red de AWS (VPC, subredes, rutas, Security Groups) y la gestión de identidades y permisos (**IAM**).
- Configurar servidores de forma reproducible con **Ansible**.
- Empaquetar y ejecutar aplicaciones con **Docker** y orquestarlas con **Kubernetes**.
- Automatizar pruebas y despliegues con **CI/CD (GitHub Actions)**, sin credenciales permanentes (OIDC).
- Desplegar con **GitOps (Argo CD)** y operar lo desplegado con **monitorización y logs**.
- Aplicar seguridad desde el principio: **mínimo privilegio**, análisis de código, imágenes y secretos.
- Controlar los costes de todo lo que despliego.
Vengo del mundo de la ciberseguridad (trabajo en un SOC) y quiero combinar esa base con experiencia en infraestructura y automatización.
 
---
 
## 🏗️ Arquitectura objetivo
 
```text
Developer
    |
    v
VS Code --> Git --> GitHub --> GitHub Actions
                                   |
              +--------------------+--------------------+
              |                                         |
              v                                         v
       Terraform checks                          Security scans
                                              (Checkov / Trivy / Gitleaks)
              |
              v
       Infrastructure plan
              |
              v
   AWS authentication (OIDC + IAM role)
              |
              v
       AWS infrastructure
              |
              v
   Application deployment
   (EC2 / Docker / Kubernetes)
              |
              v
   Monitoring and logging
   (Prometheus / Grafana / Loki)
```
 
---
 
## 🛠️ Tecnologías
 
| Tecnología | Para qué la uso | Estado |
|---|---|---|
| AWS | Infraestructura cloud | En uso |
| Terraform | Infraestructura como código | En uso |
| AWS CLI | Consultar y gestionar recursos | En uso |
| Git y GitHub | Control de versiones y colaboración | En uso |
| AWS Systems Manager | Administrar instancias sin abrir SSH | En uso |
| Ansible | Configuración de servidores | Previsto |
| GitHub Actions | CI/CD | Previsto |
| Docker | Contenedores | Previsto |
| Kubernetes | Orquestación de contenedores | Previsto |
| Argo CD | GitOps | Previsto |
| Prometheus, Grafana, Loki | Observabilidad | Previsto |
| Checkov, Trivy, Gitleaks | Seguridad en el pipeline | Previsto |
 
---
 
## 📍 Estado actual
 
**Fase 0 completada. Fase A (infraestructura base) construida; pendiente retirar la antigua.**
 
Estoy reconstruyendo el proyecto desde cero para repasar cada concepto con calma, en una rama separada (`rebuild/v2`) para no tocar la versión anterior de `main`. Toda la infraestructura nueva está definida en Terraform, con el estado en S3.
 
Hecho hasta ahora:
 
- [x] Root protegido con MFA y presupuesto mensual con alertas.
- [x] Acceso humano con usuario sin permisos + MFA, y roles asumidos con credenciales temporales.
- [x] Roles por función: `lab-terraform-deployer` (construye), `lab-admin` (administra IAM) y `lab-ssm-operator` (entrar a las máquinas; permisos pendientes).
- [x] Estado de Terraform en S3 con versionado, cifrado y bloqueo nativo.
- [x] Red: VPC, subredes pública y privada, Internet Gateway y tablas de rutas.
- [x] Security Group web (80/443, sin SSH).
- [x] Rol e instance profile de la EC2 en código, con SSM.
- [x] EC2 con disco cifrado, IMDSv2 obligatorio y acceso solo por Session Manager.
Pendiente de esta fase:
 
- [ ] Migrar la página web al repositorio y desplegarla en la nueva instancia.
- [ ] Retirar la infraestructura antigua una vez comprobado lo nuevo.
---
 
## 🗺️ Roadmap
 
### Fase 0 — Cimientos de la cuenta
- [x] Root protegido con MFA.
- [x] Presupuesto y alertas de coste.
- [x] Acceso humano con credenciales temporales.
- [x] Identidad de Terraform con mínimo privilegio.
### Fase A — Terraform y AWS base
- [x] Estado remoto en S3 con bloqueo.
- [x] Red: VPC, subredes pública y privada, Internet Gateway, rutas.
- [x] Security Group web (sin SSH).
- [x] IAM, rol e instance profile definidos en código.
- [x] Instancia EC2 con disco cifrado e IMDSv2 obligatorio.
### Fase B — Aplicación y despliegue
- [ ] Nginx y página web desplegadas desde el repositorio.
- [ ] Flujo de trabajo con ramas y pull requests.
- [ ] GitHub Actions con autenticación OIDC.
### Fase C — Ansible
- [ ] Configuración de Nginx, usuarios y hardening como código.
### Fase D — Docker
- [ ] Contenerizar la web, Docker Compose y escaneo de imágenes.
### Fase E — Kubernetes
- [ ] Entorno local o de bajo coste primero.
- [ ] EKS solo si está justificado y con coste controlado.
### Fase F — GitOps
- [ ] Despliegue con Argo CD.
### Fase G — Observabilidad
- [ ] Prometheus, Grafana, Loki y alertas.
### Fase H — DevSecOps
- [ ] Checkov, Trivy y Gitleaks en el pipeline.
- [ ] CloudTrail, AWS Config y GuardDuty.
---
 
## 🧭 Decisiones de diseño
 
- **Reconstruir desde cero** en una rama aparte, para repasar todos los conceptos y dejar un único origen de verdad (el código).
- **Estado de Terraform remoto en S3**, no en un ordenador local, porque trabajo desde más de un equipo.
- **IAM en código** desde el principio, con mínimo privilegio.
- **Sin SSH abierto**: la administración se hará con Systems Manager.
- **Sin credenciales permanentes** en CI/CD: autenticación por OIDC.
- **Regla de trabajo**: leer siempre `terraform plan` antes de aplicar cualquier cambio.
---
 
## 💰 Costes
 
El laboratorio usa créditos de AWS, así que controlo el gasto desde el principio:
 
- Presupuesto con alertas configurado antes de crear recursos.
- Evito servicios que cobran por hora si no son necesarios (por ejemplo, NAT Gateway o EKS) hasta que haya una razón clara.
- Una instancia EC2 parada sigue generando coste de disco e IP pública.
---
 
## 🔐 Seguridad
 
- No se guardan credenciales, claves ni secretos en el repositorio.
- El estado de Terraform nunca se sube a Git.
- Permisos de mínimo privilegio; nada de `AdministratorAccess` como atajo.
- Solo se abren los puertos imprescindibles.
---
 
*Construyendo mi propia infraestructura cloud, paso a paso.*
 