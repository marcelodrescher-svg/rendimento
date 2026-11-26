// Configuração do aplicativo Rendimento Aeroagrícola – Drescher Consultoria
// Veja COMO-PUBLICAR.md para saber de onde vem cada valor.
//
// scriptUrl      -> endereço do "App da Web" do Google Apps Script (termina em /exec). Passo 2 do guia.
//                   Enquanto estiver vazio, o app funciona em MODO DE TESTE: nada é enviado,
//                   o código de confirmação aparece na tela e o cadastro fica só no aparelho.
// googleClientId -> "ID do cliente" OAuth do Google Cloud (termina em .apps.googleusercontent.com). Passo 4.
//                   Enquanto estiver vazio, o botão "Continuar com Google" não aparece.
//                   O MESMO valor precisa estar em GOOGLE_CLIENT_ID no Codigo.gs.
window.APP_CONFIG = {
  scriptUrl: "",
  googleClientId: "",
  validadeMeses: 12
};
