import type { Locale } from "@/lib/i18n";

export type AuthSignupStrings = {
  title: string;
  lead: string;
  continueEmail: string;
  name: string;
  email: string;
  password: string;
  submit: string;
  submitting: string;
  hasAccount: string;
  loginLink: string;
  legalPrefix: string;
  terms: string;
  legalMidPrivacy: string;
  privacy: string;
  legalMidCookies: string;
  cookies: string;
  legalSuffix: string;
  captchaError: string;
  accountCreated: string;
  confirmEmailTitle: string;
  confirmEmailMessage: string;
  confirmEmailHint: string;
  goToLogin: string;
  resendEmail: string;
  resendSending: string;
  resendSuccess: string;
  resendError: string;
};

export const authSignupCopy: Record<Locale, AuthSignupStrings> = {
  "pt-BR": {
    title: "Criar conta grátis",
    lead: "Teste as ferramentas principais e veja como seu currículo conversa com uma vaga real.",
    continueEmail: "Continuar com e-mail",
    name: "Nome",
    email: "E-mail",
    password: "Senha",
    submit: "Criar meu currículo grátis",
    submitting: "Criando...",
    hasAccount: "Já tem conta?",
    loginLink: "Entrar",
    legalPrefix: "Ao criar conta, você concorda com os",
    terms: "Termos de Uso",
    legalMidPrivacy: ", a",
    privacy: "Política de Privacidade",
    legalMidCookies: " e a",
    cookies: "Política de Cookies",
    legalSuffix: ".",
    captchaError: "Confirme o captcha para criar sua conta.",
    accountCreated: "Conta criada. Se o Supabase pedir confirmação, abra seu e-mail; senão você já pode entrar.",
    confirmEmailTitle: "Confirme seu e-mail",
    confirmEmailMessage:
      "Enviamos um link de confirmação para seu e-mail. Verifique também a caixa de spam ou promoções.",
    confirmEmailHint: "Depois de confirmar, volte aqui e entre com o mesmo e-mail e senha.",
    goToLogin: "Ir para login",
    resendEmail: "Reenviar e-mail de confirmação",
    resendSending: "Reenviando...",
    resendSuccess: "Enviamos outro e-mail de confirmação. Confira sua caixa de entrada.",
    resendError: "Não foi possível reenviar agora. Aguarde alguns minutos e tente de novo."
  },
  en: {
    title: "Create a free account",
    lead: "Start with a trial generation.",
    continueEmail: "Continue with email",
    name: "Full name",
    email: "Email",
    password: "Password",
    submit: "Create my resume for free",
    submitting: "Creating...",
    hasAccount: "Already have an account?",
    loginLink: "Log in",
    legalPrefix: "By creating an account you agree to the",
    terms: "Terms of Use",
    legalMidPrivacy: ", the",
    privacy: "Privacy Policy",
    legalMidCookies: ", and the",
    cookies: "Cookie Policy",
    legalSuffix: ".",
    captchaError: "Please complete the captcha to create your account.",
    accountCreated: "Account created. If Supabase requires email confirmation, check your inbox; otherwise you can sign in now.",
    confirmEmailTitle: "Confirm your email",
    confirmEmailMessage:
      "We sent a confirmation link to your email. Also check your spam or promotions folder.",
    confirmEmailHint: "After confirming, return here and sign in with the same email and password.",
    goToLogin: "Go to log in",
    resendEmail: "Resend confirmation email",
    resendSending: "Resending...",
    resendSuccess: "We sent another confirmation email. Check your inbox.",
    resendError: "Could not resend right now. Wait a few minutes and try again."
  },
  es: {
    title: "Crear cuenta gratis",
    lead: "Empieza con una generación de prueba.",
    continueEmail: "Continuar con correo",
    name: "Nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    submit: "Crear mi currículum gratis",
    submitting: "Creando...",
    hasAccount: "¿Ya tienes cuenta?",
    loginLink: "Iniciar sesión",
    legalPrefix: "Al crear una cuenta aceptas los",
    terms: "Términos de uso",
    legalMidPrivacy: ", la",
    privacy: "Política de privacidad",
    legalMidCookies: " y la",
    cookies: "Política de cookies",
    legalSuffix: ".",
    captchaError: "Confirma el captcha para crear tu cuenta.",
    accountCreated: "Cuenta creada. Si Supabase pide confirmación, revisa tu correo; si no, ya puedes entrar.",
    confirmEmailTitle: "Confirma tu correo",
    confirmEmailMessage:
      "Enviamos un enlace de confirmación a tu correo. Revisa también spam o promociones.",
    confirmEmailHint: "Después de confirmar, vuelve aquí e inicia sesión con el mismo correo y contraseña.",
    goToLogin: "Ir a iniciar sesión",
    resendEmail: "Reenviar correo de confirmación",
    resendSending: "Reenviando...",
    resendSuccess: "Enviamos otro correo de confirmación. Revisa tu bandeja de entrada.",
    resendError: "No pudimos reenviar ahora. Espera unos minutos e inténtalo de nuevo."
  },
  fr: {
    title: "Créer un compte gratuit",
    lead: "Commencez par une génération d’essai.",
    continueEmail: "Continuer avec l’e-mail",
    name: "Nom",
    email: "E-mail",
    password: "Mot de passe",
    submit: "Créer mon CV gratuitement",
    submitting: "Création...",
    hasAccount: "Vous avez déjà un compte ?",
    loginLink: "Connexion",
    legalPrefix: "En créant un compte, vous acceptez les",
    terms: "Conditions d’utilisation",
    legalMidPrivacy: ", la",
    privacy: "Politique de confidentialité",
    legalMidCookies: " et la",
    cookies: "Politique relative aux cookies",
    legalSuffix: ".",
    captchaError: "Veuillez valider le captcha pour créer votre compte.",
    accountCreated: "Compte créé. Si Supabase demande une confirmation, consultez votre boîte mail ; sinon vous pouvez vous connecter.",
    confirmEmailTitle: "Confirmez votre e-mail",
    confirmEmailMessage:
      "Nous avons envoyé un lien de confirmation à votre adresse. Vérifiez aussi les spams ou l’onglet promotions.",
    confirmEmailHint: "Après confirmation, revenez ici et connectez-vous avec le même e-mail et mot de passe.",
    goToLogin: "Aller à la connexion",
    resendEmail: "Renvoyer l’e-mail de confirmation",
    resendSending: "Envoi en cours...",
    resendSuccess: "Nous avons renvoyé un e-mail de confirmation. Consultez votre boîte de réception.",
    resendError: "Impossible de renvoyer pour le moment. Attendez quelques minutes et réessayez."
  }
};

export type AuthRecoverStrings = {
  title: string;
  email: string;
  submit: string;
  backLogin: string;
  sentMessage: string;
};

export const authRecoverCopy: Record<Locale, AuthRecoverStrings> = {
  "pt-BR": {
    title: "Recuperar senha",
    email: "E-mail",
    submit: "Enviar link",
    backLogin: "Voltar ao login",
    sentMessage: "Se este e-mail existir, você receberá um link de recuperação."
  },
  en: {
    title: "Reset password",
    email: "Email",
    submit: "Send link",
    backLogin: "Back to login",
    sentMessage: "If that email exists, you will receive a recovery link."
  },
  es: {
    title: "Recuperar contraseña",
    email: "Correo electrónico",
    submit: "Enviar enlace",
    backLogin: "Volver al inicio de sesión",
    sentMessage: "Si ese correo existe, recibirás un enlace de recuperación."
  },
  fr: {
    title: "Réinitialiser le mot de passe",
    email: "E-mail",
    submit: "Envoyer le lien",
    backLogin: "Retour à la connexion",
    sentMessage: "Si cette adresse existe, vous recevrez un lien de récupération."
  }
};

export type AuthResetStrings = {
  title: string;
  lead: string;
  newPassword: string;
  confirmPassword: string;
  submit: string;
  checking: string;
  saving: string;
  save: string;
  backLogin: string;
  tooShort: string;
  mismatch: string;
  linkInvalid: string;
  requestNew: string;
  expiredBanner: string;
  errorUpdate: string;
};

export const authResetCopy: Record<Locale, AuthResetStrings> = {
  "pt-BR": {
    title: "Criar nova senha",
    lead: "Defina uma senha segura para voltar ao dashboard.",
    newPassword: "Nova senha",
    confirmPassword: "Confirmar senha",
    submit: "Salvar nova senha",
    checking: "Validando link...",
    saving: "Salvando...",
    save: "Salvar nova senha",
    backLogin: "Voltar ao login",
    tooShort: "Use pelo menos 6 caracteres.",
    mismatch: "As senhas não conferem.",
    linkInvalid: "O link expirou ou é inválido. Solicite uma nova recuperação.",
    requestNew: "Solicitar novo link",
    expiredBanner: "Este link expirou ou não abriu corretamente. Solicite um novo link de recuperação.",
    errorUpdate: "O link expirou ou é inválido. Solicite uma nova recuperação."
  },
  en: {
    title: "Create a new password",
    lead: "Choose a strong password to return to your dashboard.",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    submit: "Save new password",
    checking: "Validating link...",
    saving: "Saving...",
    save: "Save new password",
    backLogin: "Back to login",
    tooShort: "Use at least 6 characters.",
    mismatch: "Passwords do not match.",
    linkInvalid: "The link expired or is invalid. Request a new reset.",
    requestNew: "Request new link",
    expiredBanner: "This link expired or did not open correctly. Request a new recovery link.",
    errorUpdate: "The link expired or is invalid. Request a new reset."
  },
  es: {
    title: "Crear nueva contraseña",
    lead: "Define una contraseña segura para volver al panel.",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    submit: "Guardar nueva contraseña",
    checking: "Validando enlace...",
    saving: "Guardando...",
    save: "Guardar nueva contraseña",
    backLogin: "Volver al inicio de sesión",
    tooShort: "Usa al menos 6 caracteres.",
    mismatch: "Las contraseñas no coinciden.",
    linkInvalid: "El enlace expiró o no es válido. Solicita un nuevo restablecimiento.",
    requestNew: "Solicitar nuevo enlace",
    expiredBanner: "Este enlace expiró o no se abrió correctamente. Solicita un nuevo enlace de recuperación.",
    errorUpdate: "El enlace expiró o no es válido. Solicita un nuevo restablecimiento."
  },
  fr: {
    title: "Créer un nouveau mot de passe",
    lead: "Choisissez un mot de passe robuste pour revenir au tableau de bord.",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    submit: "Enregistrer le mot de passe",
    checking: "Validation du lien...",
    saving: "Enregistrement...",
    save: "Enregistrer le mot de passe",
    backLogin: "Retour à la connexion",
    tooShort: "Utilisez au moins 6 caractères.",
    mismatch: "Les mots de passe ne correspondent pas.",
    linkInvalid: "Le lien a expiré ou est invalide. Demandez une nouvelle réinitialisation.",
    requestNew: "Demander un nouveau lien",
    expiredBanner: "Ce lien a expiré ou ne s’est pas ouvert correctement. Demandez un nouveau lien de récupération.",
    errorUpdate: "Le lien a expiré ou est invalide. Demandez une nouvelle réinitialisation."
  }
};
