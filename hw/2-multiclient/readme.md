// 1. Реализовать работу системы с произвольным кол-вом вычислительных клиентов
// и отслеживать их занятость, т.е. мы имеем массив клиентов, отмечаем в нем, что
// некоторые получили задачу и еще не вернули ответ, и можем разделять новые задачи
// в любой момент на свободных клиентов.

// Idea:
// Can be solved with observer pattern:
// Each client shoulld extend the EE functionality.
// When each client will finish it's work, then it can be returned into the 'available' clients.

// Task manager
// - responsible for giving task to available clients.

// Client
// - should be able to inform task manager when the work will be finished
