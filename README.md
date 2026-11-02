# AWS Secure Infrastructure ☁️

Laboratorio práctico de **AWS, Terraform, Infrastructure as Code (IaC) y Cloud Security**, desarrollado para construir progresivamente una infraestructura cloud reproducible, documentada y con controles de seguridad.

El objetivo es aprender a diseñar, desplegar y proteger infraestructura en AWS mediante código, aplicando buenas prácticas de seguridad, control de versiones, automatización y gestión de costes.

## 🎯 Objetivos de aprendizaje

- Diseñar y gestionar infraestructura mediante Terraform (IaC).
- Comprender redes de AWS, subredes, tablas de rutas y grupos de seguridad.
- Aplicar el principio de mínimo privilegio en IAM.
- Revisar y validar cambios antes de desplegar infraestructura.
- Identificar y corregir configuraciones inseguras.
- Aprender a desplegar y administrar instancias EC2.
- Administrar instancias mediante AWS Systems Manager.
- Incorporar análisis de seguridad y controles en CI/CD.
- Documentar decisiones técnicas, pruebas y errores encontrados.
- Controlar los costes de los recursos desplegados en AWS.

## 🛠️ Tecnologías

- **AWS:** infraestructura y servicios cloud.
- **Terraform:** definición y gestión de infraestructura como código.
- **AWS CLI:** interacción con AWS desde la terminal.
- **AWS Systems Manager (SSM):** administración remota de instancias EC2.
- **Session Manager Plugin:** conexión desde Windows mediante SSM.
- **Git y GitHub:** control de versiones y documentación.
- **GitHub Actions:** automatización del flujo de trabajo (planificado).
- **Checkov:** análisis estático de seguridad para infraestructura como código (planificado).
- **Ubuntu Server 24.04 LTS:** sistema operativo de la instancia EC2.

## 📍 Estado actual

**Fase 3 — EC2 desplegada, protegida y acceso remoto mediante AWS Systems Manager validado.**

Se ha desplegado una instancia EC2 Ubuntu 24.04 LTS en la subred pública de la VPC. También se ha configurado un rol IAM específico para la instancia y se ha validado la conexión mediante AWS Systems Manager Session Manager.

La conexión remota se ha probado correctamente desde Windows, obteniendo acceso a la terminal de Ubuntu sin utilizar SSH ni abrir el puerto 22.

### Recursos desplegados

| Recurso | Configuración |
|---|---|
| Cuenta AWS | `172155958881` |
| Región AWS | `eu-west-1` |
| Zona de disponibilidad | `eu-west-1a` para las subredes existentes |
| Perfil AWS CLI | `terraform-lab` |
| VPC | `10.20.0.0/16` |
| Subred pública | `10.20.1.0/24` |
| Subred privada | `10.20.2.0/24` |
| Internet Gateway | Conectado a la VPC |
| Tabla de rutas pública | Asociada a la subred pública, con ruta predeterminada al Internet Gateway |
| Tabla de rutas privada | Asociada a la subred privada, sin ruta predeterminada a Internet |
| Security Group web | `terraform-secure-lab-web-sg` |
| Regla de entrada HTTP | TCP/80 desde `0.0.0.0/0` |
| Regla de entrada HTTPS | TCP/443 desde `0.0.0.0/0` |
| Instancia EC2 | `terraform-secure-lab-web` |
| ID de instancia | `i-0178928ffdac7aeb5` |
| Sistema operativo | Ubuntu Server 24.04 LTS |
| Tipo de instancia | `t3.micro` |
| Disco raíz | 8 GB EBS gp3, cifrado |
| Protección de metadatos | IMDSv2 obligatorio |
| Estado EC2 | `running` (última comprobación) |
| IP pública observada | `54.195.147.88` |
| IP privada observada anteriormente | `10.20.1.224` |

Las direcciones IP pueden cambiar cuando la instancia se detiene y vuelve a arrancar. No deben considerarse permanentes.

**Importante:** las reglas HTTP y HTTPS permiten conexiones entrantes desde cualquier dirección IPv4. Esto puede ser apropiado para un servicio web público, pero deberá revisarse cuando se despliegue la aplicación. Actualmente no se ha instalado ni validado un servidor web.

La subred privada no dispone de una ruta predeterminada hacia Internet. No se ha configurado un NAT Gateway.

### Configuración de seguridad de EC2

La instancia se ha definido en Terraform con las siguientes medidas:

- Disco raíz cifrado mediante EBS.
- Eliminación del disco raíz al terminar la instancia (`delete_on_termination = true`).
- Uso obligatorio de tokens IMDSv2 para acceder a los metadatos.
- Asociación al Security Group de la capa web.
- Etiquetas para identificar el entorno, el propietario de la gestión y la función del recurso.
- Administración remota mediante AWS Systems Manager.
- Sin necesidad de exponer SSH a Internet.

### Configuración IAM para Systems Manager

Para permitir que AWS Systems Manager administre la instancia, se ha creado la siguiente estructura:

| Elemento | Nombre |
|---|---|
| Rol IAM | `EC2-SSM-Lab-Role` |
| Instance Profile | `EC2-SSM-Lab-Profile` |
| Política administrada de AWS | `AmazonSSMManagedInstanceCore` |

El rol utiliza una relación de confianza que permite a EC2 asumirlo mediante el servicio `ec2.amazonaws.com`.

La política `AmazonSSMManagedInstanceCore` proporciona los permisos necesarios para que el agente SSM de la instancia pueda comunicarse con Systems Manager.

Se ha comprobado que:

- El rol existe y tiene la relación de confianza correcta.
- La política `AmazonSSMManagedInstanceCore` está asociada al rol.
- El Instance Profile contiene el rol correcto.
- La instancia EC2 muestra asociado `EC2-SSM-Lab-Profile`.

### Configuración de Systems Manager

Se ha comprobado el registro y la comunicación de la instancia con AWS Systems Manager mediante:

```powershell
aws ssm describe-instance-information --region eu-west-1 --profile terraform-lab --query "InstanceInformationList[].[InstanceId,PingStatus,PlatformName,AgentVersion]" --output table
```

Resultado obtenido:

| Instance ID | Ping Status | Platform | Agent Version |
|---|---|---|---|
| `i-0178928ffdac7aeb5` | `Online` | Ubuntu | `3.3.4793.0` |

El estado `Online` confirma que AWS Systems Manager reconoce la instancia y que el agente está comunicándose correctamente.

### Acceso remoto mediante Session Manager

Se ha validado una conexión interactiva desde Windows utilizando AWS CLI.

Comando utilizado:

```powershell
aws ssm start-session --target i-0178928ffdac7aeb5 --region eu-west-1 --profile terraform-lab
```

La conexión se inició correctamente y devolvió una sesión:

```text
Starting session with SessionId: terraform-lab-p5lh8by3j34jsrpb3dc78fkk8e
$
```

El prompt `$` corresponde a la terminal de Ubuntu dentro de la instancia EC2.

Para finalizar la sesión:

```bash
exit
```

Esto cierra la sesión remota y devuelve al usuario a PowerShell en Windows.

**Resultado:** acceso remoto a Ubuntu validado mediante SSM, sin utilizar SSH ni abrir el puerto 22.

### Instalación de Session Manager Plugin en Windows

Para que AWS CLI pueda abrir sesiones interactivas, es necesario instalar el Session Manager Plugin en el equipo local.

Descarga oficial:

https://s3.amazonaws.com/session-manager-downloads/plugin/latest/windows/SessionManagerPluginSetup.exe

Pasos realizados:

1. Descargar `SessionManagerPluginSetup.exe`.
2. Ejecutar el instalador de Windows.
3. Completar la instalación.
4. Comprobar la existencia del ejecutable en la ruta predeterminada.

Ruta comprobada:

```text
C:\Program Files\Amazon\SessionManagerPlugin\bin\session-manager-plugin.exe
```

Comprobación de existencia:

```powershell
Test-Path "C:\Program Files\Amazon\SessionManagerPlugin\bin\session-manager-plugin.exe"
```

Resultado:

```text
True
```

También se comprobó que el ejecutable funcionaba invocándolo directamente:

```powershell
& "C:\Program Files\Amazon\SessionManagerPlugin\bin\session-manager-plugin.exe"
```

El programa devolvió:

```text
The Session Manager plugin was installed successfully. Use the AWS CLI to start a session.
```

**Nota:** inicialmente PowerShell no reconocía `session-manager-plugin` como comando porque no encontraba el ejecutable mediante el PATH. Se comprobó que estaba instalado y se trabajó con su ruta completa. Posteriormente AWS CLI consiguió iniciar la sesión correctamente.

## 🧱 Organización de Terraform

- `main.tf`: definición del proveedor y los recursos principales.
- `variables.tf`: parámetros configurables, como región y bloques CIDR.
- `outputs.tf`: valores de salida de la infraestructura.
- `.terraform.lock.hcl`: versiones bloqueadas de los proveedores.
- `terraform.tfstate`: estado local de Terraform; debe mantenerse fuera del repositorio y protegerse adecuadamente.

El estado de Terraform relaciona los recursos declarados en el código con los recursos administrados en AWS. No debe publicarse ni compartirse sin las medidas de protección adecuadas.

## 🧪 Validaciones y operaciones realizadas

Durante el desarrollo se han utilizado los siguientes comandos:

| Comando | Objetivo |
|---|---|
| `terraform init` | Inicializar Terraform |
| `terraform fmt` | Formatear los archivos de configuración |
| `terraform validate` | Comprobar la validez de la configuración |
| `terraform plan` | Revisar los cambios propuestos antes de desplegar |
| `terraform apply` | Aplicar la configuración y crear recursos |
| `aws ec2 describe-security-groups` | Consultar las reglas del Security Group |
| `aws ec2 describe-images` | Consultar imágenes de sistema disponibles |
| `aws ec2 describe-instance-types` | Consultar las características de `t3.micro` |
| `aws ec2 describe-instances` | Consultar el estado y las direcciones de la instancia |
| `aws ec2 start-instances` | Iniciar una instancia detenida |
| `aws ec2 stop-instances` | Detener una instancia |
| `aws iam get-instance-profile` | Consultar el Instance Profile y el rol asociado |
| `aws iam list-attached-role-policies` | Consultar las políticas asociadas a un rol |
| `aws ec2 describe-iam-instance-profile-associations` | Consultar asociaciones de perfiles IAM en EC2 |
| `aws ec2 associate-iam-instance-profile` | Asociar un Instance Profile a una instancia |
| `aws ec2 disassociate-iam-instance-profile` | Desasociar un Instance Profile |
| `aws ssm describe-instance-information` | Consultar las instancias administradas por SSM |
| `aws ssm start-session` | Abrir una sesión remota mediante SSM |
| `session-manager-plugin` | Comprobar el plugin local de Session Manager |

### Incidencias y soluciones

#### 1. Permisos para iniciar la instancia EC2

Al intentar arrancar la instancia se obtuvo:

```text
UnauthorizedOperation:
not authorized to perform ec2:StartInstances
```

La política `TerraformLabReadOnly` no incluía inicialmente `ec2:StartInstances`.

Se añadió la acción a su bloque de permisos de gestión de recursos y se comprobó mediante IAM Policy Simulator.

Después de resolver la autorización, el comando de inicio funcionó correctamente.

#### 2. Asociación del Instance Profile

La primera asociación del perfil IAM permaneció durante un tiempo en estado `associating`.

Se consultó el estado mediante:

```powershell
aws ec2 describe-iam-instance-profile-associations --filters "Name=instance-id,Values=i-0178928ffdac7aeb5" --region eu-west-1 --profile terraform-lab
```

Se desasoció la asociación inicial y se volvió a asociar el perfil.

Finalmente, `describe-instances` confirmó que la instancia mostraba el ARN del Instance Profile esperado.

#### 3. Permiso de consulta de Systems Manager

Al ejecutar:

```powershell
aws ssm describe-instance-information --region eu-west-1 --profile terraform-lab
```

Se obtuvo inicialmente:

```text
AccessDeniedException:
not authorized to perform ssm:DescribeInstanceInformation
```

Se añadió `ssm:DescribeInstanceInformation` a `TerraformLabReadOnly`, con `Resource: "*"`.

Aunque el permiso aparecía en la versión predeterminada de la política, el error persistió durante un tiempo. Finalmente, después de esperar, el comando funcionó y la instancia apareció como `Online`.

**Aprendizaje:** los cambios de permisos IAM pueden tardar en reflejarse. No conviene modificar repetidamente una política sin comprobar primero el resultado de la evaluación y dar tiempo a que los cambios se propaguen.

#### 4. Permisos para abrir y finalizar sesiones SSM

Al intentar abrir una sesión aparecieron errores relacionados con:

```text
ssm:StartSession
ssm:TerminateSession
```

Se añadieron las acciones correspondientes a la política de permisos del usuario de laboratorio.

La autorización de SSM debe distinguirse de los permisos del rol de la instancia: el rol EC2 permite que el agente se comunique con AWS, mientras que el usuario IAM necesita autorización para iniciar y gestionar sesiones.

#### 5. Session Manager Plugin no encontrado

AWS CLI devolvió:

```text
SessionManagerPlugin is not found.
```

Se comprobó que el ejecutable existía en:

```text
C:\Program Files\Amazon\SessionManagerPlugin\bin\session-manager-plugin.exe
```

Se verificó su funcionamiento mediante la ruta completa.

La instalación del plugin es necesaria en el ordenador desde el que se inicia la sesión; no es una instalación que deba realizarse dentro de Ubuntu.

Finalmente, AWS CLI consiguió abrir una sesión interactiva y se validó el acceso a Ubuntu.

## ✅ Progreso

- [x] Preparar Terraform, AWS CLI y Git.
- [x] Inicializar el proyecto con `terraform init`.
- [x] Validar la configuración con `terraform validate`.
- [x] Configurar Git y sincronizar con GitHub.
- [x] Versionar `.terraform.lock.hcl`.
- [x] Crear la VPC y las subredes pública y privada.
- [x] Crear y conectar el Internet Gateway.
- [x] Configurar la tabla de rutas pública.
- [x] Crear y asociar la tabla de rutas privada.
- [x] Separar la configuración en variables y outputs.
- [x] Crear el Security Group web.
- [x] Añadir reglas de entrada HTTP y HTTPS.
- [x] Crear una instancia EC2 Ubuntu mediante Terraform.
- [x] Configurar el disco raíz cifrado y los metadatos IMDSv2.
- [x] Revisar el plan antes de crear la instancia.
- [x] Comprobar el estado y las IP de la instancia.
- [x] Crear el rol IAM para la instancia.
- [x] Crear el Instance Profile.
- [x] Asociar el Instance Profile a la EC2.
- [x] Asociar `AmazonSSMManagedInstanceCore` al rol.
- [x] Comprobar el estado `Online` de SSM.
- [x] Instalar Session Manager Plugin en Windows.
- [x] Validar una conexión interactiva mediante SSM.
- [x] Comprobar la salida de la sesión con `exit`.
- [ ] Revisar las reglas de entrada y salida del Security Group.
- [ ] Revisar y documentar los permisos IAM de mínimo privilegio.
- [ ] Revisar la protección del estado de Terraform.
- [ ] Revisar la gestión del Instance Profile desde Terraform.
- [ ] Instalar y validar un servidor web.
- [ ] Incorporar análisis de seguridad de la infraestructura.

## 🗺️ Roadmap

### Fase 1 — Entorno y fundamentos

- [x] Preparar el entorno de Terraform.
- [x] Organizar el repositorio y el control de versiones.
- [x] Configurar el acceso de trabajo a AWS.

### Fase 2 — Infraestructura de red

- [x] Crear la VPC y las subredes pública y privada.
- [x] Configurar el Internet Gateway y el enrutamiento público.
- [x] Crear la tabla de rutas privada y asociarla a su subred.
- [x] Parametrizar la región y los bloques CIDR.
- [x] Crear el Security Group para la capa web.
- [ ] Revisar las rutas y las reglas de red.
- [ ] Evaluar los costes antes de añadir nuevos recursos.

### Fase 3 — EC2 y seguridad cloud

- [x] Desplegar una instancia EC2 Ubuntu mediante Terraform.
- [x] Configurar almacenamiento EBS cifrado.
- [x] Exigir tokens IMDSv2.
- [x] Verificar el estado de la instancia.
- [x] Configurar el rol IAM y el Instance Profile.
- [x] Asociar `AmazonSSMManagedInstanceCore`.
- [x] Registrar y validar la instancia en Systems Manager.
- [x] Instalar Session Manager Plugin en Windows.
- [x] Validar el acceso remoto mediante Session Manager.
- [ ] Revisar los permisos IAM y aplicar mínimo privilegio.
- [ ] Revisar las reglas de entrada y salida del Security Group.
- [ ] Instalar y probar un servidor web.
- [ ] Incorporar análisis estático con Checkov.
- [ ] Documentar riesgos, controles y decisiones de diseño.
- [ ] Revisar el almacenamiento y la protección del estado de Terraform.

### Fase 4 — Automatización DevSecOps

- [ ] Crear un workflow de GitHub Actions.
- [ ] Automatizar `terraform fmt` y `terraform validate`.
- [ ] Incorporar análisis de seguridad al flujo CI/CD.
- [ ] Revisar los planes de Terraform antes de aplicar cambios.
- [ ] Documentar las pruebas y sus resultados.

### Fase 5 — Evolución de la arquitectura

- [ ] Evaluar los componentes necesarios para desplegar una aplicación web.
- [ ] Diseñar la conectividad entre los componentes públicos y privados.
- [ ] Definir los controles de acceso y monitorización necesarios.
- [ ] Documentar el despliegue, la validación y la limpieza de recursos.

Las fases futuras se implementarán de forma incremental, evaluando su necesidad, seguridad y coste antes de desplegarlas.

## 🔐 Principios de seguridad

- No guardar credenciales, tokens ni secretos en el repositorio.
- Utilizar permisos IAM de mínimo privilegio.
- Revisar `terraform plan` antes de desplegar cambios.
- Mantener el estado de Terraform fuera del repositorio y protegerlo adecuadamente.
- Evaluar los costes antes de crear recursos adicionales.
- Evitar exposiciones innecesarias a Internet.
- Limitar el acceso de red a los puertos y orígenes que realmente se necesiten.
- Evitar abrir SSH si existe una alternativa de administración segura.
- Utilizar Systems Manager para administrar las instancias cuando sea posible.
- Documentar los riesgos, las pruebas y las medidas de mitigación.
- Revisar el estado real de los recursos en AWS después de aplicar cambios.
- Detener o eliminar los recursos de laboratorio cuando no sean necesarios, comprobando previamente las consecuencias sobre los datos y el estado de Terraform.

## 💰 Control de costes

El laboratorio utiliza créditos promocionales de AWS, por lo que el coste debe revisarse durante todo el desarrollo.

- La instancia EC2 está actualmente en ejecución según la última comprobación. Esto puede generar cargos de computación.
- El almacenamiento EBS continúa existiendo y puede generar costes incluso con la instancia detenida.
- Otros recursos, incluida la dirección IPv4 pública, pueden generar cargos.
- No se ha creado un NAT Gateway.
- Antes de incorporar servicios adicionales, se revisarán sus costes y su necesidad para el aprendizaje.

Los créditos promocionales están sujetos a las condiciones y la fecha de caducidad indicadas en AWS Billing.

## 💡 Objetivo final

Construir un laboratorio reproducible que demuestre conocimientos prácticos de **Cloud Engineering, Terraform, automatización y Cloud Security**, explicando cada componente y justificando las decisiones técnicas.

El proyecto evoluciona de forma incremental: primero se construyen los fundamentos de red, después se incorporan máquinas virtuales y controles de seguridad, y finalmente se automatizan las validaciones y el flujo de trabajo.