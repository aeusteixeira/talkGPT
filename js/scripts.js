let recognizer;
let output;
let radio;
let interimTranscript = '';
let finalTranscript = '';

function startRecording() {
  output = document.getElementById('output');
  const speakButton = document.getElementById('speakButton');

  output.textContent = 'Gravando...';

  radio = document.getElementById('radioButton');
  radio.classList.add('recording');

  recognizer = new webkitSpeechRecognition() || new SpeechRecognition();
  recognizer.lang = 'pt-BR';
  recognizer.continuous = true;
  recognizer.interimResults = true;

  recognizer.onresult = function (event) {
    let interimText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimText += transcript;
      }
    }

    interimTranscript = interimText;
    output.innerHTML = finalTranscript + '<span style="color: gray;">' + interimTranscript + '</span>';
  };

  recognizer.start();
}

function stopRecording() {
  if (recognizer) {
    recognizer.stop();
    output.innerHTML += ' Gravação finalizada.';
    radio.classList.remove('recording');
  }
}

function speakTranscription() {
  const textToSpeak = output.innerText;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // Obtenha a voz selecionada pelo usuário
  const voiceSelect = document.getElementById('voiceSelect');
  const selectedVoice = voiceSelect.value;

  // Encontre a voz correspondente pelo nome
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.name === selectedVoice);

  // Defina a voz para a utterance
  utterance.voice = voice;

  speechSynthesis.speak(utterance);
}

function speakTranscription() {
  const textToSpeak = output.innerText;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  speechSynthesis.speak(utterance);
}

function saveTranscription() {
  const transcription = finalTranscript.trim();
  if (transcription.length === 0) {
    alert('Nenhuma transcrição disponível para salvar.');
    return;
  }

  const blob = new Blob([transcription], {
    type: 'text/plain;charset=utf-8'
  });
  const a = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'transcription.txt';
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Obtém o elemento select
const voiceSelect = document.getElementById('voiceSelect');

// Função para popular as opções de vozes
function populateVoiceList() {
  // Obtém as vozes disponíveis
  const voices = speechSynthesis.getVoices();

  // Limpa as opções existentes
  voiceSelect.innerHTML = '';

  // Cria uma opção para cada voz disponível
  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = voice.name;
    voiceSelect.appendChild(option);
  });
}

// Evento para popular as opções de vozes assim que estiverem prontas
speechSynthesis.addEventListener('voiceschanged', populateVoiceList);

// Chama a função inicialmente para popular as vozes
populateVoiceList();