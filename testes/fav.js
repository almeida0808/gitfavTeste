export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = document.querySelector("table tbody");

    this.load();
  }

  load() {
    this.DadosUsers = [
      {
        login: "almeida0808",
        name: "Lucas Almeida",
        public_repos: "1",
        followers: "821",
      },
      {
        login: "maykbrito",
        name: "Mayk Brito",
        public_repos: "76",
        followers: "21222",
      },
      {
        login: "diego3g",
        name: "Diego Fernandes",
        public_repos: "231",
        followers: "921",
      },
    ];
  }

  delete(user){
    const filterDados = this.DadosUsers.filter(
      dado => dado.login !== user.login
    )
this.DadosUsers = filterDados

this.update()

  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.update();
  }

  update() {
    this.removeAllTr();

    this.DadosUsers.forEach((user) => {
      const row = this.createRow();
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector(".user p").innerHTML = user.name;
      row.querySelector(".user span").innerHTML = `/${user.login}`;
      row.querySelector(".repositorios").innerHTML = user.public_repos;
      row.querySelector(".seguidores").innerHTML = user.followers;

      row.querySelector('.buttonRemove').onclick = () => {
        const confirmIsOk = confirm('Você deseja remover este usuário?')
        console.log(confirmIsOk)
        if(confirmIsOk){
          this.delete(user)
        }
      }

      this.tbody.append(row);
    });
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <tr>
    <td>
      <div class="user">
        <img src="https://github.com/maykbrito.png" alt="" />
        <a href="" target="blank_"
          ><p>Mayk Brito</p>
          <span>/maykbrito</span>
        </a>
      </div>
    </td>
    <td class="repositorios">13423</td>
    <td class="seguidores">12321</td>
    <td><button class="buttonRemove">Remover</button></td>
  </tr>
    `;

    return tr;
  }
}
