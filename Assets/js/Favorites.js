import { GitHubSearch } from "./GitHubSearch.js";

class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)

        this.tableTbody = this.root.querySelector("table tbody");

        this.load();
    }

    entriesporenquanto = [
        {
            "login": "diego3g",
            "name": "Diego Fernandes",
            "public_repos": "65",
            "followers": "12545"
        },
        {
            "login": "maykbrito",
            "name": "Mayk Brito",
            "public_repos": "47",
            "followers": "12577"
        }
    ]

    load() {
        window.localStorage.setItem("@git-fav", JSON.stringify(this.entriesporenquanto))
        this.entries = JSON.parse(window.localStorage.getItem("@git-fav")) || [];
        console.log(GitHubSearch.search('gkpavesi').then(data => console.log(data)))
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

    remove(element) {
        const isOkToDelete = confirm("Tem certeza que deseja remover?")

        if (isOkToDelete) {
            this.entries = this.entries.filter(data => data.login !== element.login)

            this.update();
        }
    }


}

class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.emptyScreen = this.root.querySelector('#empty');

        this.update();

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

    toggleEmptyScreen() {
        const isEmpty = this.entries.length == 0

        isEmpty ? this.emptyScreen.classList.remove("hide") : this.emptyScreen.classList.add("hide");
    }

}

export { FavoritesView }