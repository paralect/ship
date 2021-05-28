const addPostfix = (allFiles) => {
  const map = {};
  const names = allFiles.map((file) => file.file.name);

  const count = names.map((name) => {
    const value = map[name] ? map[name] + 1 : 1;
    map[name] = value;
    return value;
  });

  allFiles.map((file, index) => {
    const newFile = { ...file };
    const { name } = newFile.file;

    if (map[name] !== 1 && count[index] - 1) {
      const words = name.split('.');
      words[words.length - 2] = `${words[words.length - 2]} (${count[index] - 1})`;
      newFile.meta.name = words.join('.');
    } else newFile.meta.name = name;

    return newFile;
  });
};

export default addPostfix;
