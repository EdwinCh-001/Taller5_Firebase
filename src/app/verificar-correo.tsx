/**
 * Confirmación del correo electrónico antes de permitir el acceso a la app.
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { PantallaHoja } from '@/components/pantalla-hoja';
import { useSesion } from '@/context/sesion';
import { mensajeDeError } from '@/lib/errores-firebase';

export default function PantallaVerificarCorreo() {
  const { usuario, enviarCorreoVerificacion, recargarUsuario, cerrarSesion } = useSesion();
  const [mensaje, setMensaje] = useState<string | null>(
    'Revisa tu bandeja de entrada y confirma tu correo para continuar.',
  );
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [comprobando, setComprobando] = useState(false);

  async function manejarReenvio() {
    setEnviando(true);
    setErrorGeneral(null);
    try {
      await enviarCorreoVerificacion();
      setMensaje('Correo de verificación enviado. Revisa también la carpeta de spam.');
    } catch (error) {
      setErrorGeneral(mensajeDeError(error));
    } finally {
      setEnviando(false);
    }
  }

  async function manejarComprobacion() {
    setComprobando(true);
    setErrorGeneral(null);
    try {
      const verificado = await recargarUsuario();
      if (verificado) {
        router.replace('/(app)');
      } else {
        setMensaje('Tu correo todavía no aparece verificado. Confirma el enlace y vuelve a comprobar.');
      }
    } catch (error) {
      setErrorGeneral(mensajeDeError(error));
    } finally {
      setComprobando(false);
    }
  }

  async function manejarSalida() {
    await cerrarSesion();
  }

  return (
    <PantallaHoja
      titulo={'Verifica tu\ncorreo'}
      bajada={`Enviamos un enlace a ${usuario?.email ?? 'tu correo electrónico'}.`}>
      {mensaje ? <Aviso tipo="exito" mensaje={mensaje} /> : null}
      {errorGeneral ? <Aviso tipo="error" mensaje={errorGeneral} /> : null}

      <Boton texto="Ya verifiqué mi correo" onPress={manejarComprobacion} cargando={comprobando} />
      <Boton
        variante="secundario"
        texto="Reenviar correo"
        onPress={manejarReenvio}
        cargando={enviando}
      />
      <Boton variante="enlace" texto="Cerrar sesión" onPress={manejarSalida} />
    </PantallaHoja>
  );
}
