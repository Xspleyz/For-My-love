    const kalimat = [
      "pean tau engga?",
      "dari semua hal indah di dunia ini..", 
      "pean adalah favoritku",
      "tidak peduli seberapa sulit hidup ini",
      "seberapa capek hari hari berjalan",
      "cukup dengar suara pean..",
      "senyuman pean..",
      "semua terasa ringan",
      "pean bukan sekedar pasangan",
      "setiap hari aku bersyukur",
      "karena semesta engga cuma mempertemukan kita",
      "tapi ajarin aku bagaimana rasanya dicintai dengah tulus",
      "aku engga menyangka bisa sejauh ini sama pean",
      "pean adalah rumah ternyaman",
      "tempat aku pulang setelah semua lelah",
      "terima kasih sudah bersamaku sampe saat ini",
      "pean adalah tempat cerita", 
      "pelukan hangat", 
      "semangat hidupku",
      "aku bersama pean selalu",
      "selamanya",
      "happy anniverseray cinta..",
      "semoga tahun-tahun kedepannya..",
      "makin banyak cerita",
      "makin kuat",
      "makin saling jaga",
      "i always love you^^",
    ];
    
  // Tunda tampilnya konten dan blur 3 detik
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      document.querySelector(".content").classList.add("blur-active");
    }, 2000);
  });

   let index = 0;

function tampilkanPesan() {
  const pesanEl = document.getElementById("pesan");
  pesanEl.textContent = kalimat[index];
  pesanEl.style.animation = "none";
  void pesanEl.offsetWidth;
  pesanEl.style.animation = "fadeIn 1s ease";

  index++;
  if (index >= kalimat.length) index = 0; // balik ke awal kalau sudah habis
}

    document.addEventListener("click", () => {
      const audio = document.getElementById("lagu");
      audio.play().catch(() => {});
    }, { once: true });

    class Tool {
      static randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      static randomColorHSL(h, s, l) {
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
    }

    class Angle {
      constructor(a) {
        this.a = a;
        this.rad = (a * Math.PI) / 180;
      }

      incDec(num) {
        this.a += num;
        this.rad = (this.a * Math.PI) / 180;
      }
    }

    let canvas;

    class Canvas {
      constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resize();
        this.hearts = [];
        this.offHearts = [];
      }

      resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.heartSize = this.width < 768 ? 180 : 250;
      }

      offInit() {
        const h = new Heart(this.ctx, this.width / 2, this.height / 2.3, this.heartSize);
        this.offHearts.push(h);
        h.draw();
        this.data = this.ctx.getImageData(0, 0, this.width, this.height).data;

        let index = 0;
        for (let y = 0; y < this.height; y += 12) {
          for (let x = 0; x < this.width; x += 12) {
            let idx = (x + y * this.width) * 4 + 3;
            if (this.data[idx] > 0) {
              index++;
              const heart = new Heart(this.ctx, x + Tool.randomNumber(-3, 3), y + Tool.randomNumber(-3, 3), Tool.randomNumber(6, 12), index);
              this.hearts.push(heart);
            }
          }
        }
      }

      render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (const heart of this.hearts) {
          heart.render();
        }
      }
    }

    class Heart {
      constructor(ctx, x, y, r, i) {
        this.ctx = ctx;
        this.init(x, y, r, i);
      }

      init(x, y, r, i) {
        this.x = this.xi = x;
        this.y = this.yi = y;
        this.r = r;
        this.i = i * 0.5 + 200;
        this.l = this.i;
        this.c = Tool.randomColorHSL(Tool.randomNumber(-5, 5), 80, 60);
        this.a = new Angle(Tool.randomNumber(0, 360));
        this.v = { x: Math.random(), y: -Math.random() };
        this.ga = Math.random();
      }

      draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = this.ga;
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.moveTo(this.x, this.y + this.r);
        ctx.bezierCurveTo(this.x - this.r - this.r / 5, this.y + this.r / 1.5, this.x - this.r, this.y - this.r, this.x, this.y - this.r / 5);
        ctx.bezierCurveTo(this.x + this.r, this.y - this.r, this.x + this.r + this.r / 5, this.y + this.r / 1.5, this.x, this.y + this.r);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      updateParams() {
        this.a.incDec(1);
        this.r = Math.abs(Math.sin(this.a.rad) * 20);
      }

      updatePosition() {
        this.l--;
        if (this.l < 0) {
          this.v.y -= 0.01;
          this.v.x += 0.02;
          this.y += this.v.y;
          this.x += this.v.x;
        }
      }

      wrapPosition() {
        if (this.x > canvas.width * 1.5) {
          this.init(this.xi, this.yi, Tool.randomNumber(6, 12), this.i);
        }
      }

      render() {
        this.wrapPosition();
        this.updateParams();
        this.updatePosition();
        this.draw();
      }
    }

    window.addEventListener("load", () => {
      canvas = new Canvas();
      canvas.offInit();

      function animate() {
        requestAnimationFrame(animate);
        canvas.render();
      }
      animate();

      window.addEventListener("resize", () => {
        canvas.resize();
        canvas.hearts = [];
        canvas.offHearts = [];
        canvas.offInit();
      });
    });
