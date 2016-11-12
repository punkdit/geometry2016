
from math import *


def padd(p, q):
    return (p[0]+q[0], p[1]+q[1])

def prmul(s, p):
    return (s*p[0], s*p[1])


# -------------------------------------------------------

canvas = document.getElementById('canvas-fano')
width = canvas.width
height = canvas.height
ctx = canvas.getContext('2d')

def render_fano(ctx):

    #ctx.fillStyle = 'cornflowerblue'
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 5
    
    offset = (width/2, height/2)
    ctx.save()
    ctx.translate(offset[0], 1.3*offset[1]) # BUG BUG doesn't work with *

    R = width/8.
    R1 = R / cos(pi/3)
    R2 = R * tan(pi/3)
    r = 10

    ctx.beginPath()
    ctx.arc(0, 0, R, 0, 2*pi)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, -R1)
    ctx.lineTo(R2, R)
    ctx.lineTo(-R2, R)
    ctx.closePath()
    ctx.stroke()

    theta = pi/2
    for i in range(3):

        ctx.beginPath()
        ctx.moveTo(R*cos(theta), R*sin(theta))
        ctx.lineTo(R1*cos(theta+pi), R1*sin(theta+pi))
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(R*cos(theta), R*sin(theta), r, 0, 2*pi)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(R1*cos(theta+pi), R1*sin(theta+pi), r, 0, 2*pi)
        ctx.fill()

        theta += 2*pi/3
        #ctx.strokeStyle = 'green'

    ctx.beginPath()
    ctx.arc(0, 0, r, 0, 2*pi)
    ctx.fill()

    ctx.restore()

render_fano(ctx)


# -------------------------------------------------------


def status(message):
    document.getElementById('status').innerHTML = message

def debug(*info):
    element = document.getElementById('status')
    element.innerHTML += ' '.join([str(i) for i in info]) + "<br>"

def check(result, message):
    if not result:
        debug(message)


# -------------------------------------------------------


GREEN = "forestgreen"
BROWN = "peru"

#GREEN = "#00CC00"
#BROWN = "#FF9900"


canvas = document.getElementById('canvas-thin')



width = canvas.width
height = canvas.height
offset = (width/2, height/2)

ctx = canvas.getContext('2d')

mouse_x = 0.5*width
mouse_y = 0.5*height


ctx.font = '38pt Arial'
#ctx.fillStyle = 'cornflowerblue'
#ctx.strokeStyle = 'blue'
ctx.lineWidth = 5


#    ctx.fillText("Hello World!", width/2 - 150, height/2 + 15)
#    ctx.strokeText("Hello World!", width/2 - 150, height/2 + 15 )

def hexagon(x0, y0, r):
    theta = 0.
    ctx.beginPath()
    x = x0+r*cos(theta)
    y = y0+r*sin(theta)
    ctx.moveTo(x, y)
    for i in range(6):
        theta += pi/3
        x = x0+r*cos(theta)
        y = y0+r*sin(theta)
        ctx.lineTo(x, y)
    ctx.fill()
    #ctx.stroke()



radius = 50
radius1 = 0.85 * radius
dps = []
theta = 0.
for i in range(6):
    dps.append((radius*cos(theta), radius*sin(theta)))
    theta += pi/3.


class Player(object):
    def __init__(self):
        self.point = dps[0]
        self.line = 0 # 0, 2, 4
        self.face = +1 # +1, -1
        canvas.addEventListener('keydown', self.keydown_event, False);

    def render(self):
        x, y = self.point
        r = 5
        ctx.fillStyle = GREEN
        ctx.strokeStyle = GREEN
        ctx.beginPath()
        ctx.arc(x, y, r, 0., 2*pi)
        ctx.fill()

        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(x, y)
        check(0<=self.line<6, "line = {}".format(str(self.line)))
        dx, dy = dps[self.line]
        ctx.lineTo(x+dx, y+dy)
        ctx.stroke()

        dx, dy = dps[(self.line+self.face)%6]
        hexagon(x+dx, y+dy, radius1)

    def send_point(self):
        self.point = padd(self.point, dps[self.line])
        self.line = (self.line+3)%6
        self.face = -self.face

    def send_line(self):
        #self.line = (self.line+2)%6
        self.line = (self.line + 2*self.face)%6
        self.face = -self.face

    def send_face(self):
        self.face = -self.face

    def keydown_event(self, e):
        status("keydown {}".format(e.key))
        if e.key == 'j':
            self.send_point()
        elif e.key == 'k':
            self.send_line()
        elif e.key == 'l':
            self.send_face()
        #render()
        window.requestNextAnimationFrame(render)
        


player = Player()

state = "paused"

def render(time):

    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(offset[0], offset[1]) # BUG BUG doesn't work with *

    N = 5

    ctx.fillStyle = BROWN
    di = padd(dps[1], dps[0])
    dj = padd(dps[5], dps[0])
    for i in range(-N, N):
        for j in range(-N, N):
            p = padd(prmul(i, di), prmul(j, dj))
            hexagon(p[0], p[1], radius1)

    #ctx.globalAlpha = 0.5
    player.render()
    ctx.restore()

    global state
    if state == "paused":
        render_paused(ctx)
    else:
        ctx.globalAlpha = 1.0


def render_paused(ctx):
    ctx.globalAlpha = 0.5
    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.rect(0, 0, width, height)
    ctx.fill()

    ctx.save()
    ctx.translate(offset[0], offset[1]) # BUG BUG doesn't work with *

    ctx.globalAlpha = 1.0
    ctx.beginPath()
    ctx.arc(0, 0, 70, 0, 2*pi)
    ctx.fill()

    status("paused")
    ctx.globalAlpha = 1.0
    ctx.lineWidth = 10
    ctx.strokeStyle = "white"
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(0, 0, 50, 0, 2*pi)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(20, 0)
    ctx.lineTo(-10, 20)
    ctx.lineTo(-10, -20)
    ctx.closePath()
    ctx.fill()
    ctx.restore()



# https://developer.mozilla.org/en-US/docs/Web/API/Event
def mouse_event(e):
    global mouse_x, mouse_y
    mouse_x = e.offsetX
    mouse_y = e.offsetY
    global state
    state = "playing"
    status("play")
    ctx.globalAlpha = 1.0
    window.requestNextAnimationFrame(render)

canvas.addEventListener('mousedown', mouse_event, False);

window.requestNextAnimationFrame(render)







