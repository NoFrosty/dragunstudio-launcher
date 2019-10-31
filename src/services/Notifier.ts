
class Notifier {
    Error(message: string) {
        alert(message);
    }
}
var notifier = new Notifier();

export default notifier;