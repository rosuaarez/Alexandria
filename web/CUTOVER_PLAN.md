# Plan de Cutover — Alexandría

## Pre-cutover (hacer antes de cambiar el dominio)
- [ ] Deploy de web/ en Vercel funcionando en URL preview
- [ ] /api/health muestra todos los servicios verdes
- [ ] SSO funciona end-to-end con el otro proyecto
- [ ] Crear/editar/eliminar protocolos funciona
- [ ] Al menos 1 usuario real probó el flujo completo

## El cutover
Opción A — Nuevo proyecto Vercel (recomendada):
  1. Crear nuevo proyecto Vercel apuntando a web/
  2. Asignar el dominio de producción al nuevo proyecto
  3. El HTML monolítico queda en el proyecto Vercel anterior
     (fallback inmediato si algo falla)

Opción B — Mismo proyecto Vercel:
  1. Cambiar Root Directory de "." a "web" en el proyecto existente
  2. Actualizar vercel.json en la raíz del repo
  RIESGO: si falla el build, el HTML monolítico también cae

## Post-cutover
- [ ] Verificar todas las rutas en producción
- [ ] Confirmar que los usuarios existentes pueden iniciar sesión
- [ ] Monitorear errores en Vercel durante 24h
- [ ] Backup: el HTML monolítico sigue en public/index.html
        — puede restaurarse cambiando el Root Directory en Vercel

## Rollback (si algo falla)
1. En Vercel → Settings → Root Directory → cambiar de "web" a "."
2. Trigger redeploy
3. El HTML monolítico vuelve a servir en minutos
