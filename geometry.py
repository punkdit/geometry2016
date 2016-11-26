
from math import *


def padd(p, q):
    return (p[0]+q[0], p[1]+q[1])

def psub(p, q):
    return (p[0]-q[0], p[1]-q[1])

def prmul(s, p):
    return (s*p[0], s*p[1])

def pnorm(p):
    return (p[0]**2 + p[1]**2)**0.5

def pdist(p, q):
    return pnorm(psub(p, q))


# -------------------------------------------------------


def status(message):
    document.getElementById('status').innerHTML = message

def debug(*info):
    element = document.getElementById('status')
    element.innerHTML += ' '.join([str(i) for i in info]) #+ "<br>"

def check(result, message):
    if not result:
        debug(message)


# -------------------------------------------------------

class Graphic(object):
    "lives in a canvas"
    def __init__(self, canvas, colour):
        self.canvas = canvas
        self.ctx = canvas.ctx
        self.children = []
        self.colour = colour
        self.highlight = False
        canvas.items.add(self)

    def distance(self, x, y):
        return 99999


HIGHTLIGHT = "orange"
EXPAND = 2.0

class Line(Graphic):
    def __init__(self, canvas, x0, y0, x1, y1, width=1., colour="black"):
        self.c0 = (x0, y0)
        self.c1 = (x1, y1)
        self.width = width
        Graphic.__init__(self, canvas, colour)

    def render(self):
        ctx = self.ctx
        if self.highlight:
            ctx.strokeStyle = HIGHTLIGHT
            ctx.lineWidth = EXPAND*self.width
            ctx.beginPath()
            ctx.moveTo(self.c0[0], self.c0[1])
            ctx.lineTo(self.c1[0], self.c1[1])
            ctx.stroke()

        ctx.strokeStyle = self.colour
        ctx.lineWidth = self.width
        ctx.beginPath()
        ctx.moveTo(self.c0[0], self.c0[1])
        ctx.lineTo(self.c1[0], self.c1[1])
        ctx.stroke()

    def distance(self, x, y):
        p = (x, y)
        c0, c1 = self.c0, self.c1
        r = pdist(c0, c1)
        a = pdist(c0, p)
        b = pdist(c1, p)
        return 1.+(a+b)-r # lazy man's metric


class Circle(Graphic):
    def __init__(self, canvas, x, y, r, width=1., colour="black"):
        self.c = (x, y)
        self.r = r
        self.width = width
        Graphic.__init__(self, canvas, colour)

    def render(self):
        ctx = self.ctx
        if self.highlight:
            ctx.strokeStyle = HIGHTLIGHT
            ctx.lineWidth = EXPAND*self.width
            ctx.beginPath()
            ctx.arc(self.c[0], self.c[1], self.r, 0, 2*pi)
            ctx.stroke()

        ctx.strokeStyle = self.colour
        ctx.lineWidth = self.width
        ctx.beginPath()
        ctx.arc(self.c[0], self.c[1], self.r, 0, 2*pi)
        ctx.stroke()

    def distance(self, x, y):
        r = pdist(self.c, (x, y))
        return 0.5*abs(r - self.r)


class Text(Graphic):
    def __init__(self, canvas, x, y, text):
        self.x = x
        self.y = y
        self.text = text
        Graphic.__init__(self, canvas, "black")

    def render(self):
        ctx = self.ctx
        ctx.font = "48px serif";
        ctx.fillStyle = self.colour
        ctx.fillText(self.text, self.x, self.y)


class Disc(Circle):
    def render(self):
        ctx = self.ctx
        if self.highlight:
            ctx.fillStyle = HIGHTLIGHT
            ctx.beginPath()
            ctx.arc(self.c[0], self.c[1], 0.8*EXPAND*self.r, 0, 2*pi)
            ctx.fill()
        ctx.fillStyle = self.colour
        ctx.beginPath()
        ctx.arc(self.c[0], self.c[1], self.r, 0, 2*pi)
        ctx.fill()

    def distance(self, x, y):
        r = pdist(self.c, (x, y))
        if r > self.r:
            return r - self.r
        return 0.


class Rectangle(Graphic):
    def __init__(self, canvas, x, y, w, h, colour):
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        Graphic.__init__(self, canvas, colour)

    def render(self):
        ctx = self.ctx
        ctx.fillStyle = self.colour
        ctx.beginPath()
        ctx.rect(self.x, self.y, self.w, self.h)
        ctx.fill()


class Canvas(object):
    def __init__(self, name='canvas', offset=(0, 0)):
        canvas = document.getElementById(name)
        self.width = canvas.width
        self.height = canvas.height
        self.ctx = canvas.getContext('2d')
        self.offset = offset
        self.items = []
        canvas.addEventListener('mousedown', self.mouse_event, False);

    def mouse_event(self, e):
        mouse_x = e.offsetX
        mouse_y = e.offsetY
        #status("mouse!")
        window.requestNextAnimationFrame(self.render)

        for item in self.items:
            item.highlight = False

        item = self.hit(mouse_x, mouse_y)

        if item is None:
            #self.render()
            return

        if len(item.children):
            for child in item.children:
                #debug(child.__class__.__name__, "red")
                child.highlight = True
        item.highlight = True

        #self.render()

    def translate(self, dx, dy):
        self.offset = padd(self.offset, (dx, dy))

    def line(self, x0, y0, x1, y1, width=1., colour="black"):
        dx, dy = self.offset
        line = Line(self, x0+dx, y0+dy, x1+dx, y1+dy, width, colour)
        return line

    def circle(self, x, y, r, width=1., colour="black"):
        dx, dy = self.offset
        return Circle(self, x+dx, y+dy, r, width, colour)

    def disc(self, x, y, r, colour="black"):
        dx, dy = self.offset
        return Disc(self, x+dx, y+dy, r, width, colour)

    def rectangle(self, x, y, w, h, colour):
        dx, dy = self.offset
        return Rectangle(self, x+dx, y+dy, w, h, colour)

    def text(self, x, y, text):
        dx, dy = self.offset
        return Text(self, x+dx, y+dy, text)

    def render(self):
        ctx = self.ctx
        width, height = self.width, self.height
        #ctx.fillStyle = "lightgrey"
        ctx.clearRect(0, 0, width, height)
        #ctx.beginPath()
        #ctx.rect(0, 0, width, height)
        #ctx.fill()
        ctx.save()
        ctx.translate(width/2, height/2)
        for item in self.items:
            item.render(ctx)
        ctx.restore()

    def hit(self, x, y):
        items = self.items
        if not items:
            return None
        width, height = self.width, self.height
        x -= width/2
        y -= height/2
        best = None
        r = 20 # click radius
        for item in items:
            r1 = item.distance(x, y)
            if r1<r:
                best = item
                r = r1
        return best


class Flag(object):
    def __init__(self, line):
        self.line = line
        self.point = None


POINT = "ForestGreen"
LINE = "FireBrick"
#SURFACE = "RoyalBlue"
SURFACE = "SteelBlue"

def render_flag():
    canvas = Canvas("canvas-flag")
    width, height = canvas.width, canvas.height

    R = 0.4*height
    r = 10

    canvas.rectangle(0, -R, 1.3*R, 1.0*R, SURFACE)
    canvas.line(0, -R, 0, +R, 5, LINE)
    canvas.disc(0, -R, r, POINT)

    canvas.render()


render_flag()
    

def fano_chambers():

    canvas = Canvas("canvas-fano-chambers")
    width, height = canvas.width, canvas.height

    R = 0.22*height
    R1 = R / cos(pi/3)
    R2 = R * tan(pi/3)
    r = 10

    canvas.translate(-0.25*width, 0.)

    L1 = canvas.circle(0, 0, R, 5, LINE)
    L2 = canvas.line(0, -R1, R2, R, 5, LINE)
    L3 = canvas.line(R2, R, -R2, R, 5, LINE)
    L4 = canvas.line(-R2, R, 0, -R1, 5, LINE)

    theta = pi/2

    L5 = canvas.line(R*cos(theta), R*sin(theta), R1*cos(theta+pi), R1*sin(theta+pi), 5, LINE)
    P1 = canvas.disc(R*cos(theta), R*sin(theta), r, POINT)
    P2 = canvas.disc(R1*cos(theta+pi), R1*sin(theta+pi), r, POINT)
    theta += 2*pi/3

    L6 = canvas.line(R*cos(theta), R*sin(theta), R1*cos(theta+pi), R1*sin(theta+pi), 5, LINE)
    P3 = canvas.disc(R*cos(theta), R*sin(theta), r, POINT)
    P4 = canvas.disc(R1*cos(theta+pi), R1*sin(theta+pi), r, POINT)
    theta += 2*pi/3

    L7 = canvas.line(R*cos(theta), R*sin(theta), R1*cos(theta+pi), R1*sin(theta+pi), 5, LINE)
    P5 = canvas.disc(R*cos(theta), R*sin(theta), r, POINT)
    P6 = canvas.disc(R1*cos(theta+pi), R1*sin(theta+pi), r, POINT)

    P7 = canvas.disc(0, 0, r, POINT)

    points = [P7, P4, P6, P3, P1, P2, P5]
    lines =  [L7, L6, L3, L4, L1, L5, L2]

    canvas.text(-100, 0.4*height, "Geometry")

    # Chambers

    R = 0.35*height
    canvas.translate(+0.50*width, -0.1*height)

    dtheta = (2*pi)/14
    theta = 3*pi/2
    for i in range(14):
        item = canvas.line(R*cos(theta), R*sin(theta), R*cos(theta-dtheta), R*sin(theta-dtheta), 5.)
        if i%2==0:
            item.children.append(points[i/2])
            item.children.append(lines[i/2])
        else:
            item.children.append(points[(i-1)/2])
            item.children.append(lines[((i+1)/2)%7])

        if i%2==0:
            item = canvas.line(R*cos(theta), R*sin(theta), R*cos(theta+9*dtheta), R*sin(theta+9*dtheta), 5.)
            item.children.append(points[((i+4)/2)%7])
            item.children.append(lines[i/2])

        theta -= dtheta


#    theta = pi/2
#    for i in range(7):
#        item = canvas.line(-R*cos(theta), -R*sin(theta), -R*cos(theta+5*dtheta), -R*sin(theta+5*dtheta), 5.)
#        theta += 2*dtheta

    theta = pi/2
    for i in range(7):
        item = canvas.disc(R*cos(theta), -R*sin(theta), r, LINE)
        item.children.append(lines[i])
        lines[i].children.append(item)
        theta += dtheta

        item = canvas.disc(R*cos(theta), -R*sin(theta), r, POINT)
        item.children.append(points[i])
        points[i].children.append(item)
        theta += dtheta

    canvas.text(-100, 0.5*height, "Incidence")

    canvas.render()

fano_chambers()


# -------------------------------------------------------


def fano_appartment():

    canvas = Canvas("canvas-fano-appartment")
    width, height = canvas.width, canvas.height

    R = 0.40*height
    r = 10

    canvas.translate(-0.25*width, -0.1*height)

    pts = []
    theta = 3*pi/12. + pi/2.
    dtheta = 2*pi/12.
    for i in range(12):
        x = R*cos(theta)
        y = -R*sin(theta)
        pts.append((x, y))
        theta += dtheta

    p, q = pts[0], pts[7]
    L1 = canvas.line(p[0], p[1], q[0], q[1], 5, LINE)
    p, q = pts[3], pts[8]
    L2 = canvas.line(p[0], p[1], q[0], q[1], 5, LINE)
    p, q = pts[4], pts[11]
    L3 = canvas.line(p[0], p[1], q[0], q[1], 5, LINE)

    R1 = 0.5*R
    theta = pi/2. + pi/6.
    P1 = canvas.disc(R1*cos(theta), -R1*sin(theta), r, POINT)
    theta += 2*pi/3
    P2 = canvas.disc(R1*cos(theta), -R1*sin(theta), r, POINT)
    theta += 2*pi/3
    P3 = canvas.disc(R1*cos(theta), -R1*sin(theta), r, POINT)

    canvas.text(-100, 0.5*height, "Geometry")

    # Chambers

    R = 0.35*height
    canvas.translate(+0.50*width, -0.0*height)

    pts = []
    theta = pi/2. + pi/6.
    for i in range(6):
        x = R1*cos(theta)
        y = -R1*sin(theta)
        pts.append((x, y))
        theta += 2*pi/6.

    points = [P1, P2, P2, P3, P3, P1]
    lines =  [L3, L3, L2, L2, L1, L1]
    for i in range(6):
        p = pts[i]
        q = pts[(i+1)%6]
        item = canvas.line(p[0], p[1], q[0], q[1], 5.)
        item.children.append(points[i])
        item.children.append(lines[i])

    for i in range(6):
        p = pts[i]
        if i%2==0:
            item = canvas.disc(p[0], p[1], r, POINT)
            item.children.append(points[i])
            points[i].children.append(item)
        else:
            item = canvas.disc(p[0], p[1], r, LINE)
            item.children.append(lines[i])
            lines[i].children.append(item)

    canvas.text(-100, 0.5*height, "Incidence")

    canvas.render()

fano_appartment()


    

# -------------------------------------------------------
    

canvas = document.getElementById('canvas-fano')
width = canvas.width
height = canvas.height
ctx = canvas.getContext('2d')

POINT = "ForestGreen"
LINE = "FireBrick"

#LINE = "ForestGreen"
#POINT = "FireBrick"

def render_fano(ctx):

    #ctx.fillStyle = 'cornflowerblue'
    ctx.fillStyle = POINT
    ctx.strokeStyle = LINE
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


canvas = document.getElementById('canvas-chambers')
width = canvas.width
height = canvas.height
ctx = canvas.getContext('2d')

def render_chambers(ctx):

    #ctx.fillStyle = 'cornflowerblue'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 5
    
    offset = (width/2, height/2)
    ctx.save()
    ctx.translate(offset[0], 1.0*offset[1]) # BUG BUG doesn't work with *

    R = 0.44*width
    r = 10

    theta = pi/2
    dtheta = (2*pi)/14
    for i in range(14):

        ctx.beginPath()
        ctx.moveTo(R*cos(theta), R*sin(theta))
        ctx.lineTo(R*cos(theta+dtheta), R*sin(theta+dtheta))
        ctx.stroke()

        theta += dtheta

    theta = pi/2
    for i in range(7):

        ctx.beginPath()
        ctx.moveTo(R*cos(theta), -R*sin(theta))
        ctx.lineTo(R*cos(theta+5*dtheta), -R*sin(theta+5*dtheta))
        ctx.stroke()

        theta += dtheta

        ctx.beginPath()
        ctx.moveTo(R*cos(theta), -R*sin(theta))
        ctx.lineTo(R*cos(theta-5*dtheta), -R*sin(theta-5*dtheta))
        ctx.stroke()

        theta += dtheta

    theta = pi/2
    for i in range(7):

        ctx.fillStyle = LINE
        ctx.beginPath()
        ctx.arc(R*cos(theta), -R*sin(theta), r, 0, 2*pi)
        ctx.fill()

        theta += dtheta

        ctx.fillStyle = POINT
        ctx.beginPath()
        ctx.arc(R*cos(theta), -R*sin(theta), r, 0, 2*pi)
        ctx.fill()

        theta += dtheta


    ctx.restore()

render_chambers(ctx)



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
#radius1 = 0.85 * radius
radius1 = 0.95 * radius
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
        self.word = ""
        canvas.addEventListener('keydown', self.keydown_event, False);

    def render(self):
        x, y = self.point
        #ctx.fillStyle = GREEN
        #ctx.strokeStyle = GREEN

        ctx.fillStyle = SURFACE
        dx, dy = dps[(self.line+self.face)%6]
        hexagon(x+dx, y+dy, radius1)

        ctx.strokeStyle = LINE
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(x, y)
        check(0<=self.line<6, "line = {}".format(str(self.line)))
        dx, dy = dps[self.line]
        ctx.lineTo(x+dx, y+dy)
        ctx.stroke()

        r = 8
        ctx.fillStyle = POINT
        ctx.beginPath()
        ctx.arc(x, y, r, 0., 2*pi)
        ctx.fill()

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
        #status("keydown {}".format(e.key))
        word = self.word
        if e.key == 'j':
            self.send_point()
            word = "J"+word
        elif e.key == 'k':
            self.send_line()
            word = "K"+word
        elif e.key == 'l':
            self.send_face()
            word = "L"+word
        status(word)
        self.word = word
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

    #status("paused")
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
    #status("play")
    ctx.globalAlpha = 1.0
    window.requestNextAnimationFrame(render)

canvas.addEventListener('mousedown', mouse_event, False);

window.requestNextAnimationFrame(render)







