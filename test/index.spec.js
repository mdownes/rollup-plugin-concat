const concat = require("../index.js") 
const fs = require ('fs');

jest.mock('fs');

describe('concat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should concatenate files and write to the output file', () => {
    const readFileSyncMock = jest.fn().mockReturnValue('File content');
    const writeFileSyncMock = jest.fn();
    
    fs.readFileSync.mockImplementation(readFileSyncMock);
    fs.writeFileSync.mockImplementation(writeFileSyncMock);

    const options = {
      groupedFiles: [
        {
          files: ['file1.js', 'file2.js'],
          outputFile: 'output.js'
        }
      ]
    };

    const plugin = concat(options);
    plugin.buildStart();

    expect(readFileSyncMock).toHaveBeenCalledTimes(2);
    expect(readFileSyncMock).toHaveBeenCalledWith('file1.js', 'utf8');
    expect(readFileSyncMock).toHaveBeenCalledWith('file2.js', 'utf8');
    expect(writeFileSyncMock).toHaveBeenCalledWith(process.cwd() + '/output.js', 'File content\nFile content\n', 'utf8');
  });

  it('should throw an error if outputFile is not specified', () => {
    const options = {
      groupedFiles: [
        {
          files: ['file1.js', 'file2.js']
        }
      ]
    };

    const plugin = concat(options);

    expect(() => {
      plugin.buildStart();
    }).toThrow("You must specify an outputFile property for each set of files to be concatenated.");
  });
});
