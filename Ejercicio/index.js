console.log("hola");

const { Engine, Render, World, Bodies, Body, Events } = Matter;

class App {
    constructor(params = {}) {
        //Puedo agregar los que yo necesite, solo que este bien organizado.
        this.initCanvas();
        this.initPhysics();
        this.initBodies();

        this.updateCanvasSize();
        this.animate();
    }

    initCanvas() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener("resize", this.updateCanvasSize.bind(this));
    }

    updateCanvasSize() {
        console.log('updateCanvasSize');

        this.canvas.width = this.canvas.getBoundingClientRect().width;
        this.canvas.height = this.canvas.getBoundingClientRect().height;

        if (this.render) {
            this.render.options.width = this.canvas.width;
            this.render.options.height = this.canvas.height;
        }
    }

    initPhysics() {
        console.log(Matter);

        this.engine = Engine.create();
        this.world = this.engine.world;
        this.world.gravity.y = 0.2; // Adding gravity to fireworks

        this.render = Render.create({
            element: document.body,
            engine: this.engine,
            canvas: this.canvas,
            options: {
                showPerformance: true,
                showDebug: true,
                width: this.canvas.width,
                height: this.canvas.height,
            }
        });

        Render.run(this.render);

        this.runner = Matter.Runner.create();
        Matter.Runner.run(this.runner, this.engine);
    }

    initBodies() {
        this.particles = [];

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.createFireworks(x, y);
        });
    }

    createFireworks(x, y) {
        const getRandomColor = () => {
            const colors = ['#ff4040', '#ffdd40', '#40ffdd', '#40a6ff', '#a640ff'];
            return colors[Math.floor(Math.random() * colors.length)];
        };

        const fireworkColor = getRandomColor();


        for (let i = 0; i < 100; i++) {
            const radius = Math.random() * 3 + 2;

            const particle = Bodies.circle(x, y, radius, {
                restitution: 0.9,
                friction: 0.01,
                render: { fillStyle: fireworkColor } // Aqui todas las perticulas se vuelven del mismo color 
            });


            const forceMagnitude = 0.03 + Math.random() * 0.05;
            Body.setVelocity(particle, {
                x: (Math.random() - 0.5) * forceMagnitude * 100,
                y: (Math.random() - 0.5) * forceMagnitude * 100
            });

            this.particles.push(particle);
            World.add(this.world, particle);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        Engine.update(this.engine);

        this.particles.forEach((particle, index) => {
            this.ctx.beginPath();
            this.ctx.arc(particle.position.x, particle.position.y, particle.circleRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.render.fillStyle;
            this.ctx.fill();


            if (particle.position.y > this.canvas.height || particle.position.x < 0 || particle.position.x > this.canvas.width) {
                World.remove(this.world, particle);
                this.particles.splice(index, 1);
            }
        });

        requestAnimationFrame(this.animate.bind(this));
    }
}

// Hay que agregar esto por que sino no funciona 
const app = new App();
