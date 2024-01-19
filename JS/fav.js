export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = document.querySelector("table tbody");


    this.load();
  }

  async add(username) {
    try {
      const userExist = this.DadosUsers.find(
        (dado) => dado.login.toLowerCase() === username.toLowerCase()
      );

      if (userExist) {
        throw new Error("Este usuário já existe");
      }

      const InfoUser = await GithubUser.search(username); //infoUser = todas informações dos usuarios que ele captar
      if (InfoUser.login === undefined) {
        // se o usuario não existir emita um erro
        throw new Error("Usuário não encontrado");
      }

      this.DadosUsers = [InfoUser, ...this.DadosUsers]; // adicione as informações do novo usuario, e se caso ja tiver algum user mantenha na array

      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.DadosUsers));
  }

  load() {
    this.DadosUsers =
      JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }



  delete(user) {
    // esse parametro user é o usuario que foi clicado pra remover
    const filterDados = this.DadosUsers.filter(
      // ele vai filtrar todos os usuario, e para ele remover apenas o usuario que foi clicado ele vai fazer essa confirmação abaixo

      // a confirmação é o seguinte:
      (BancoDados) => BancoDados.login !== user.login
      // ele vai pegar o login de cada usuario dentro do banco de dados, e vai verificar se é diferente do usuario que foi clicado, se o usuario for diferente ele vai retornar true(e true mantem o usuario dentro do banco de dados), se for o mesmo usuario vai retornar false(false remove o usuario)
    );
    this.DadosUsers = filterDados; // nessa parte atualizamos a lista de dados ,passando a lista que foi filtrada, ou seja o usuario que for excluido não vai aparecer mais

    this.update(); // fazemos o update com a nova lista filtrada para remover visualmente o usuario
    this.save();
  }
}

export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((dados) => dados.json())
      .then((dados) => {
        const { login, name, public_repos, followers } = dados;

        return {
          login: login,
          name: name,
          followers: followers,
          public_repos: public_repos,
        };
      });
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.update();
    this.onAddUser();
  }



  onAddUser() {
    const btnSearch = this.root.querySelector(".buttonSearch");

    btnSearch.addEventListener("click", () => {
      const username = this.root.querySelector(".inputSearch").value;
      this.add(username);
    });
  }
  update() {
    this.noFavorites()
    this.removeAllTr();

    this.DadosUsers.forEach((user) => {
      const row = this.createRow();
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").innerHTML = user.name;
      row.querySelector(".user span").innerHTML = `/${user.login}`;
      row.querySelector(".repositorios").innerHTML = user.public_repos;
      row.querySelector(".seguidores").innerHTML = user.followers;

      row.querySelector(".buttonRemove").onclick = () => {
        const confirmIsOk = confirm("Você deseja remover este usuário?");
        console.log(confirmIsOk);
        if (confirmIsOk) {
          // se vc confirmar ele vai deletar o usuario
          this.delete(user);
        }
      };

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
    <td><button class="buttonRemove"><i class="ph ph-trash"></i></button></td>
  </tr>
    `;

    return tr;
  }

  noFavorites(){
      const painelnotUsers = document.querySelector(".notfavorites");
  
      const notUsers = (this.DadosUsers.length === 0);
  
      if (notUsers) {
        painelnotUsers.classList.remove('hide')
      }
      else{
        painelnotUsers.classList.add('hide')
    }
  }
}
