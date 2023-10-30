<script setup>
import utils from "../helpers/utils";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";

const router = useRoute();
let projectStructure = {
  metadata: {
    name: "",
    description: "",
    createdAt: 1234567890,
    icon: "",
  },
  content: {
    projectLink: "",
    image: "",
    iframe: "",
    customHTML: "",
  },
};

function prgIconDefault() {
  document.getElementById("project-icon").src =
    "https://static.vecteezy.com/system/resources/thumbnails/000/330/430/small/2_-_1_-_Pencil.jpg";
}

utils.onLoad(() => {
  console.log(router.params);
  const iconImagePicker = document.getElementById("project-icon-picker");
  const iconPreviewImage = document.getElementById("project-icon");
  const imagePicker = document.getElementById("project-image-picker");
  const previewImage = document.getElementById("project-image");

  iconImagePicker.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      iconPreviewImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
  imagePicker.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;
      document.getElementById("image-fullscreen").src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
});
let projectIcon;
let projectImage;
let iconData;
let imageData;

utils.onLoad(() => {
  projectIcon = document.getElementById("project-icon");
  projectImage = document.getElementById("project-image");
});

async function fetchIconData() {
  if (
    projectIcon.src ==
    "https://static.vecteezy.com/system/resources/thumbnails/000/330/430/small/2_-_1_-_Pencil.jpg"
  ) {
    iconData = "";
  } else {
    const response = await fetch(projectIcon.src);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    iconData = await new Promise((resolve) => {
      reader.onload = () => {
        const base64DataUrl = reader.result;
        resolve(new String(base64DataUrl).toString());
      };
    });
  }
}
async function fetchImageData() {
  if (
    projectImage.src ==
    "https://i1.wp.com/potafiori.com/wp-content/uploads/2020/04/placeholder.png"
  ) {
    imageData = "";
  } else {
    const response = await fetch(projectImage.src);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    imageData = await new Promise((resolve) => {
      reader.onload = () => {
        const base64DataUrl = reader.result;
        resolve(new String(base64DataUrl).toString());
      };
    });
  }
}

async function save() {
  let canContinue = true;
  if (utils.isEmpty(utils.getById("project-name").value)) canContinue = false;
  if (utils.isEmpty(utils.getById("project-desc").value)) canContinue = false;
  if (utils.isEmpty(utils.getById("project-date").value)) canContinue = false;
  if (!canContinue) {
    Swal.fire(
      "Campi mancanti",
      "Completa tutti i campi nel 'Metadata' per continuare",
      "warning"
    );
    return;
  }
  const dateValue = utils.getById("project-date").value;
  const created = new Date(dateValue);
  const createdTimestamp = created.getTime() / 1000;

  await fetchIconData();
  await fetchImageData();

  projectStructure = {
    metadata: {
      name: utils.getById("project-name").value,
      description: utils.getById("project-desc").value,
      createdAt: createdTimestamp,
      icon: iconData,
    },
    content: {
      projectLink: utils.getById("project-link").value,
      image: imageData,
      iframe: utils.getById("project-iframe").value,
      customHTML: utils.getById("project-html").value,
    },
  };

  utils.getById("save-btn").innerHTML =
    '<span class="loading loading-bars loading-md"></span>' +
    utils.getById("save-btn").innerHTML;
  utils.getById("save-btn").disabled = true;
  if (router.params.projectId == "new") {
    axios
      .post(
        `${config.api.baseURL}/createProject`,
        {
          projectData: projectStructure,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        Swal.fire("Error", error.response.data.error, "error");
      })
      .finally(() => {
        utils.getById("save-btn").innerHTML = "Save";
        utils.getById("save-btn").disabled = false;
      });
  }
}
</script>

<template>
  <div class="w-full mb-10">
    <h1 class="w-full text-center font-bold text-4xl">Gestisci progetto</h1>
    <div
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4"
      style="width: 99.5%"
    >
      <div class="bg-neutral w-full rounded-lg lg:ml-2">
        <div class="ml-2 mr-2">
          <h3 class="font-bold text-2xl w-full text-center mt-2">Metadata</h3>
          <div class="divider"></div>
          <h4 class="font-bold text-xl">Nome progetto</h4>
          <input
            type="text"
            placeholder="efjnefieo"
            class="input input-bordered w-full input-primary"
            id="project-name"
          />
          <h4 class="font-bold text-xl">Descrizione</h4>
          <textarea
            class="textarea textarea-warning w-full"
            id="project-desc"
            placeholder=""
            style="height: 200px"
          ></textarea>

          <h4 class="font-bold text-xl mt-3">Data creazione</h4>
          <input type="date" class="w-full input" id="project-date" />

          <h4 class="font-bold text-xl mt-3">Icona</h4>
          <div class="flex w-full justify-center">
            <div class="avatar">
              <div class="w-16 rounded-full">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/000/330/430/small/2_-_1_-_Pencil.jpg"
                  id="project-icon"
                />
              </div>
            </div>
          </div>

          <div class="flex">
            <input
              id="project-icon-picker"
              type="file"
              class="file-input file-input-bordered w-full mb-3 mt-3"
              accept=".png .jpg .gif .apng .jpeg .webp"
            />
            <button class="btn mt-3 ml-2" @click="prgIconDefault()">
              Default
            </button>
          </div>
        </div>
      </div>
      <div class="bg-neutral w-full rounded-lg lg:col-span-3">
        <h3 class="font-bold text-2xl w-full text-center mt-2">Contenuto</h3>
        <div class="divider"></div>
        <div class="ml-2 mr-2">
          <div
            class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 w-full"
          >
            <div>
              <p class="font-bold text-xl mb-2">Link progetto</p>
              <div class="form-control w-full">
                <input
                  type="text"
                  placeholder="https://"
                  class="input input-bordered w-full input-primary"
                  id="project-link"
                />
              </div>
            </div>
            <div>
              <p class="font-bold text-xl mb-2">Immagini</p>
              <input
                type="file"
                class="file-input file-input-bordered w-full mb-3 input-secondary"
                accept=".png .jpg .gif .apng .jpeg .webp"
                id="project-image-picker"
              />
              <img
                src="https://i1.wp.com/potafiori.com/wp-content/uploads/2020/04/placeholder.png"
                style="width: 100%; height: auto"
                class="mb-2 rounded-xl cursor-pointer"
                id="project-image"
                onclick="modal_see_img.showModal()"
              />
            </div>
            <div>
              <p class="font-bold text-xl mb-2">Iframe</p>
              <input
                type="text"
                placeholder="https://"
                class="input input-bordered w-full input-success"
                id="project-iframe"
              />
            </div>
            <div>
              <p class="font-bold text-xl mb-2">Salva</p>
              <button
                class="btn btn-block btn-accent"
                @click="save()"
                id="save-btn"
              >
                Salva
              </button>
            </div>
          </div>
          <h4>HTML Custom</h4>
          <div class="divider"></div>
          <p>// TODO: Sostituire la textArea con CodeMirror</p>
          <textarea
            class="textarea textarea-secondary w-full h-full"
            style="min-height: 300px"
            placeholder="<h1>aa</h1>"
            id="project-html"
          ></textarea>
        </div>
      </div>
    </div>
  </div>

  <!-- Open the modal using ID.showModal() method -->
  <dialog id="modal_see_img" class="modal">
    <div class="modal-box" style="min-width: 50%">
      <h3 class="font-bold text-lg mb-2">Anteprima</h3>
      <img
        src="https://i1.wp.com/potafiori.com/wp-content/uploads/2020/04/placeholder.png"
        style="width: 100%; height: auto"
        class="rounded-xl"
        id="image-fullscreen"
      />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>