    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const barra = document.getElementById('barra');
    const segEl = document.getElementById('seg');
    const estado = document.getElementById('estado');
    const alerta = document.getElementById('alerta-overlay');
    const alertaTxt = document.getElementById('alerta-texto');
    const infoEl = document.getElementById('info');

    let detector;
    let tiempoPersona = 0;
    let ultimoTimestamp = null;
    let alertaActiva = false;
    let audioCtx = null;

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        cargarDetector();
      };
    });

    function cargarDetector() {
      estado.textContent = 'Cargando modelo COCO-SSD...';
      detector = ml5.objectDetector('cocossd', () => {
        estado.textContent = 'Detector listo — monitoreando...';
        detectar();
      });
    }

    function detectar() {
      detector.detect(video, (err, results) => {
        ctx.clearRect(0, 0, 640, 480);
        let personaPresente = false;

        if (!err && results) {
          const personas = results.filter(r => r.label === 'person');
          personaPresente = personas.length > 0;

          results.forEach(r => {
            const esPersona = r.label === 'person';
            ctx.strokeStyle = esPersona ? '#ff4444' : '#44aaff';
            ctx.lineWidth = 3;
            ctx.strokeRect(r.x, r.y, r.width, r.height);
            ctx.fillStyle = esPersona ? '#ff444488' : '#44aaff88';
            ctx.fillRect(r.x, r.y, r.width, 22);
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText(`${r.label} ${Math.round(r.confidence*100)}%`, r.x+4, r.y+16);
          });

          infoEl.textContent = personas.length > 0
            ? ` ${personas.length} persona(s) detectada(s)`
            : 'Sin personas en frame';
        }


        const ahora = Date.now();
        if (personaPresente) {
          if (ultimoTimestamp === null) ultimoTimestamp = ahora;
          tiempoPersona += (ahora - ultimoTimestamp) / 1000;
          ultimoTimestamp = ahora;
        } else {
          tiempoPersona = Math.max(0, tiempoPersona - 0.3); 
          ultimoTimestamp = null;
        }

        tiempoPersona = Math.min(tiempoPersona, 5);
        const pct = (tiempoPersona / 5) * 100;
        barra.style.width = pct + '%';
        barra.style.background = pct < 60 ? '#ffaa00' : pct < 90 ? '#ff6600' : '#ff2200';
        segEl.textContent = tiempoPersona.toFixed(1);

        if (tiempoPersona >= 5 && !alertaActiva) {
          alertaActiva = true;
          alerta.style.display = 'block';
          alertaTxt.style.display = 'block';
          estado.textContent = '¡ALERTA ACTIVADA!';
          emitirSonido();
          setTimeout(() => {
            alertaActiva = false;
            alerta.style.display = 'none';
            alertaTxt.style.display = 'none';
            tiempoPersona = 0;
            estado.textContent = 'Monitoreando...';
          }, 3000);
        }

        setTimeout(detectar, 300);
      });
    }

    function emitirSonido() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 200, 400, 600, 800].forEach((delay, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'square';
          osc.frequency.value = i % 2 === 0 ? 880 : 660;
          gain.gain.value = 0.3;
          osc.start(audioCtx.currentTime + delay/1000);
          osc.stop(audioCtx.currentTime + delay/1000 + 0.18);
        });
      } catch(e) {}
    }
