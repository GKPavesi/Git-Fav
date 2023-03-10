import { GitHubSearch } from "./GitHubSearch.js";

class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)

        this.tableTbody = this.root.querySelector("table tbody");

        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        this.entries = JSON.parse(window.localStorage.getItem("@git-fav")) || [];
    }

    saveToLocalStorage() {
        window.localStorage.setItem("@git-fav", JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const isUsernameEmpty = username == "";
            const isUserRegistered = this.entries.find(user => user.login.toLowerCase() == username.toLowerCase());

            if (isUsernameEmpty) {
                throw new Error("Usuário não pode ser vazio")
            }
            if (isUserRegistered) {
                throw new Error("Usuário já favoritado")
            }

            const user = await GitHubSearch.search(username)
            const isUserUndefined = (user.login == undefined && user.name == undefined && user.followers == undefined && user.public_repos == undefined)

            if (isUserUndefined) {
                throw new Error("Usuário não existe")
            }

            this.entries = [user, ...this.entries];
            this.saveToLocalStorage();
            this.update();

        } catch(error) {
            alert(error)
        }
    }

    remove(element) {
        const isOkToDelete = confirm("Tem certeza que deseja remover?")

        if (isOkToDelete) {
            this.entries = this.entries.filter(data => data.login !== element.login)

            this.saveToLocalStorage();
            this.update();
        }
    }

    removeAllElements() {
        const isOkayToDeleteEverything = confirm("Tem certeza que deseja apagar todos?");
        if (isOkayToDeleteEverything) {
            this.entries.length = 0;
            this.saveToLocalStorage();
            this.update();
        }
    }
}

class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.emptyScreen = this.root.querySelector('#empty');
        this.searchButton = this.root.querySelector('#search-button');
        this.inputSearch = this.root.querySelector("#input-search");
        this.emptyAll = this.root.querySelector('#emptyAll');
        this.tableFoot = this.root.querySelector("#tfoot");

        this.addListeners();
        this.update();

    }

    update() {
        this.removeAllTr();
        this.toggleEmptyScreen();

        this.entries.forEach(element => {
            const row = this.createTr(element);
            const removeButton = row.querySelector("#remove")
            removeButton.onclick = () => {
                this.remove(element);
            }

            this.tableTbody.append(row);
        })

    }

    removeAllTr() {
        const trElements = this.root.querySelectorAll('table tbody tr');
        trElements.forEach(element => {
            element.remove();
        })
    }

    createTr(data) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <div id="image"><img src="https://github.com/${data.login}.png"
                alt="Imagem de perfil de ${data.login}"></div>
                <div id="texts">
            <p>${data.name}</p>
            <a href="https://github.com/${data.login}" target="_blank">/${data.login}</a>
                </div>
            </td>
            <td>${data.public_repos}</td>
            <td>${data.followers}</td>
            <td>
                <div id="remove">Remover</div>
            </td>
        `
        return tr;
    }

    addListeners() {
        this.searchButton.addEventListener('click', () => {
            this.searchButton.disabled = true;
            this.add(this.inputSearch.value).then(() => this.searchButton.disabled = false)
        })

        this.emptyAll.addEventListener('click', () => {
                this.removeAllElements();
        })
    }

    toggleEmptyScreen() {
        const isEmpty = this.entries.length == 0

        if (isEmpty) {
            this.emptyScreen.classList.remove("hide");
            this.tableFoot.classList.add("hide");
        } else {
            this.emptyScreen.classList.add("hide")
            this.tableFoot.classList.remove("hide")
        }
    }

}

export { FavoritesView }