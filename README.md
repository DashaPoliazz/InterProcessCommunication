## Межпроцессовое взаимодействие

[Задать вопрос](https://github.com/HowProgrammingWorks/LiveQA/discussions/categories/q-a)

[![Межпроцессовое взаимодействие в Node.js](https://img.youtube.com/vi/2OXWZFMvfbc/0.jpg)](https://www.youtube.com/watch?v=2OXWZFMvfbc)

### Через IPC в node.js

Заходим в каталог `/workers`, проект разделен на 3 файла (хотя, все можно было
бы написать и в одном, но мы делаем так для нашего удобства):

- `multicore.js` - это запускаемый модуль, запускаем так `node multicore`
- `master.js` - модуль, который запускается в родительском процессе
- `worker.js` - модуль, который запускается в дочернем процессе

Запускаем 'node multicore', который подгружает сначала `master.js` и происходит
порождение дочерних процессов по количеству ядер процессора
`os.cpus().length` при помощи `cluster.fork()`, ссылки на воркеры
складываются в массив `workers`. Родительский процесс рассылает дочерним через
`worker.send()` задачу на исполнение. Дочерний процесс ловит задачу (это
массив) и перемножает все его элементы на 2, после чего отправляет результат
обратно в родительский процесс. Когда родительский процесс получает ответы от
всех дочерних, то он выходит, завершая и дочерние.

### Через TCP сокеты

Заходим в каталог `/tcpServer`. Тут лежит пример передачи объекта из адресного
пространства одного процесса, в адресное пространство другого при помощи
протокола TCP/IP и сокетов операционной системы, API которых обернуто в
библиотеку 'net' для Node.js.

- `server.js` - серверная часть, слушает TCP порт 2000 (ждет подключений);
- `client.js` - клиентская часть, подключается к `127.0.0.1` на порт `2000`.

Запускать нужно из двух консолей, сначала из первой консоли `node server`, потом
из второй `node client`. После запуска `client.js` подключается к серверу и
отправляет ему привет. При подключении клиента, сервер отправляет ему при помощи
метода `socket.write(data)` объект `user`, сериализованный (преобразованный в
строку) через `JSON.stringify(object)`. При подключении сервер еще выводит в
консоль IP адрес клиента из `socket.localAddress`. Дальше сервер вешает событие
на получение данных из клиентского сокета через `socket.on('data', function)`.
Клиент, точно так же вешает на свой сокет событие получения данных, и когда они
приходят, то передает их для парсинга (синтаксического разбора) в метод
`JSON.parse(string)`, результатом выполнения которого, есть обычный объект
JavaScript, с которым можно работать, как с объявленным в нашем процессе,
например, читать и писать его свойства и обращаться к методам (функциям).
Например: `console.log(user.age)` или `console.log(user['age'])` или
`user.doSometging(argument)`.

## Задания

[X] 1. Сделать ту же распределенную задачу с умножением массива, пример которой
приведен в `/workers`, только на TCP сокетах.
[] 2. Усовершенствовать задачу так, чтоб массив разбивался на части, которые
отправляются в разные процессы и разные части массива должны обрабатываться в
разных процессах, а результаты сливаться в родительский процесс в любом порядке. [] 3. Сделать так, чтобы результаты склеивались в родительском процессе в том же
порядке, в котором задача была разделена на части.

## Дополнительные задания

1. Реализовать работу системы с произвольным кол-вом вычислительных клиентов
   и отслеживать их занятость, т.е. мы имеем массив клиентов, отмечаем в нем, что
   некоторые получили задачу и еще не вернули ответ, и можем разделять новые задачи
   в любой момент на свободных клиентов.
2. Реализовать два типа клиентов, первый уже есть, он выполняет вычисления, а
   второй - дает задачу серверу. Таким образом, один тип клиента это customer
   (заказчик услуги), а второй это worker (исполнитель услуги). Сервер теперь
   выполняет функцию brocker (брокера услуги).
3. Применить для обмена между процессами протокол JSTP:
   [HowProgrammingWorks/JSTP](https://github.com/HowProgrammingWorks/JSTP)
4. Реализовать любую задачу при помощи этого примера распределенных вычислений
   из курса "Численные методы" или других разделов вычислительной математики.
   Например, решение СЛАУ.
