import tornado.ioloop
import tornado.web
import tornado.httpserver


ROOT = '/home/anna/www/artnovation/mesh/'
SCRIPT_PATH = ROOT + 'scripts/'
STYLE_PATH = ROOT + 'styles'
PORT = 8888


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')


def make_server():
    app = tornado.web.Application([
        (r'/', MainHandler),
        (r'/scripts/(.*)', tornado.web.StaticFileHandler, {'path': SCRIPT_PATH}),
        (r'/styles/(.*)', tornado.web.StaticFileHandler, {'path': STYLE_PATH}),
    ], settings={
        'static_path': SCRIPT_PATH
    })
    server = tornado.httpserver.HTTPServer(app)
    return server


if __name__ == "__main__":
    server = make_server()
    server.listen(PORT)
    print 'Starting server at port 8888...'
    tornado.ioloop.IOLoop.current().start()

