// import { userStore } from './modules/user.store.js'

export const menuModule = {
  strict: true,
  state: {
    menu: {
      attachments: false,
      edit: false,
      cover: false,
      labels: false,
    },
    edit: {},
  },
  getters: {
    menu({ menu }) {
      return menu;
    },
    edit({ edit }) {
      return edit;
    },
  },
  mutations: {
    openMenu(state, { menuAction }) {
      for (let action in state.menu) {
        state.menu[action] = false;
        if (action === menuAction) {
          state.menu[action] = true;
        }
      }
    },
    openEditMenu(state, { editId }) {
      console.log(state.menu[editId ]);
      for (let e in state.menu) {
        state.menu[e] = false;
        // state.menu[editId ] = true;
        // if (e === editId) {
        //   console.log(e);
        // }
      }
      console.log(state.edit);
    },
    closeMenu(state) {
      for (let action in state.menu) {
        state.menu[action] = false;
      }
    },
    closeEditMenu(state) {
      for (let e in state.edit) {
        state.menu[e] = false;
      }
    },
    setEditMenu(state, { attachments }) {
      // console.log(attachments);
      const edit = state.edit;
      // attachments.forEach((attachment) => {
      //   edit[attachment.id] = false;
      // });
      // console.log(edit);
    },
  },
  actions: {},
};
