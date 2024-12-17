export function isTokenValid(token) {
  try {
    // Decodificar o JWT sem validar a assinatura
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Obter a data de expiração (exp) do payload
    const exp = payload.exp;

    // Verificar se o campo exp existe e se o token não expirou
    if (!exp) {
      return { isValid: false, payload: null }; // Se não houver campo de expiração
    }

    // Comparar a data de expiração com a data atual
    const currentTime = Math.floor(Date.now() / 1000); // Em segundos
    const isValid = currentTime < exp;
    return { isValid, payload };
  } catch (e) {
    console.error("Erro ao verificar o token:", e);
    return { isValid: false, payload: null };
  }
}