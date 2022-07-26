// import { userStore } from './modules/user.store.js'
import { createStore } from "vuex";
import { boardService } from "@/services/board.service.js";
import { menuModule } from "./menu.module";

const store = createStore({
  strict: true,
  starredBoard: {},
  isCover: false,
  state: {
    boardId: null,
    boards: [],
    currBoard: null,
    currGroup: null,
    currCard: null,
    isLabelsOpen: null,
    cardMembersIds: [],
  },
  getters: {
    isCover({ isCover }) {
      return isCover;
    },
    starredBoard({ starredBoard }) {
      return starredBoard;
    },
    boardsToDisplay({ boards }) {
      return boards
        .slice()
        .reverse()
        .filter((board) => {
          return !board.isStarred;
        })
        .slice(0, 4);
    },
    boards({ boards }) {
      return boards;
    },
    currBoard({ currBoard }) {
      return currBoard;
    },
    currGroup({ currGroup }) {
      return currGroup;
    },
    emptyTodo() {
      return boardService.getEmptyTodo();
    },
    emptyCard() {
      return boardService.getEmptyCard();
    },
    isLabelsOpen({ currBoard }) {
      return currBoard.labelsOpen;
    },
    cardMemberIds({ cardMembersIds }) {
      return cardMembersIds;
    },
  },
  mutations: {
    setCardMembersIds(state, { card }) {
      state.cardMembersIds = [];
      card.members.forEach((member) => {
        state.cardMembersIds.push(member._id);
      });

      console.log("member ids in store", state.cardMembersIds);
    },
    toggleMember(state, { memberId }) {
      const idx = state.card.findIndex((member) => {
        member.id === memberId;
      });
    },
    setIsCover(state, { status }) {
      state.isCover = status;
    },
    editLabel(state, { editedLabel }) {
      const idx = state.currBoard.labels.findIndex((label) => {
        return label.id === editedLabel.id;
      });
      state.currBoard.labels.splice(idx, 1, editedLabel);
    },
    removeLabel(state, { labelId }) {
      const idx = state.currBoard.labels.findIndex((label) => {
        return label.id === labelId;
      });
      state.currBoard.labels.splice(idx, 1);
    },
    setBoards(state, { boards }) {
      state.boards = boards;
    },
    setBoardId(state, { boardId }) {
      state.boardId = boardId;
    },
    setCurrBoard(state, { currBoard }) {
      state.currBoard = currBoard;
    },
    setCurrGroup(state, { groupId }) {
      state.currGroup = state.currBoard.groups.find(
        (group) => group.id === groupId
      );
    },
    addGroup(state, { group }) {
      state.currBoard.groups.push(group);
      boardService.save(state.currBoard);
    },
    addCard(state, { card }) {
      const group = state.currBoard.groups.find((group) => {
        return group.id === card.groupId;
      });
      group.cards.push(card);
      boardService.save(state.currBoard);
    },
    setIsLabelsOpen(state, { isLabelsOpen }) {
      // state.isLabelsOpen = isLabelsOpen
      state.currBoard.labelsOpen = isLabelsOpen;
    },
    starBoard(state, { boardId }) {
      const idx = state.boards.findIndex((board) => {
        return board._id === boardId;
      });
      const board = state.boards[idx];
      if (board.isStarred) {
        board.isStarred = false;
      } else {
        board.isStarred = true;
        state.boards.splice(idx, 1, board);
      }
      state.starredBoard = board;
    },
  },
  actions: {
    async loadBoards({ commit }) {
      try {
        const boards = await boardService.query();
        commit({ type: "setBoards", boards });
        return boards;
      } catch (err) {
        console.error("cannot get boards:", err);
      }
    },
    async saveBoard({ commit }, { board }) {
      const newBoard = await boardService.save(board);
      commit({ type: "setCurrBoard", currBoard: newBoard });
      return newBoard;
    },
    async saveBoards({ commit }, { boards }) {
      // boards = boards.map((board) => boardService.save(board))
      commit({ type: "setBoards", boards });
    },
    async updateGroup({ commit }, { board, group }) {
      const idx = board.groups.findIndex(
        (currGroup) => currGroup.id === group.id
      );
      board.groups.splice(idx, 1, group);
      const newBoard = await boardService.save(board);
      commit({ type: "setCurrBoard", currBoard: newBoard });
    },
  },
  modules: {
    menuModule,
  },
});

export default store;
