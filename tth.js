/**
* Toy Tetragraph Hash
*
* This function created a crytographic hash using the Toy
* Tetragraph Hash (TTH) algorithm
*
* @author	Nathan Dentzau <nathan.dentzau@gmail.com>
* @date		November 15, 2015
*/

function tth(message) {
	/**
	* Initialize the global variables
	*
	* @var alphabet a String that is split into a new Array(25);
	*
	* @var text 	a sanitized String of message with all characters
	*		capitalized. Only letters A-Z are allowed
	*		
	* @var hash 	an Array holding the running numerical total of the
	*		block's columns. The final result will will be the hash
	*/

	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	var text = message.toUpperCase().replace(/[^A-Z]+/ig, "");
	var hash = new Array(0, 0, 0, 0);
	
	/**
	* Compression Round 1: Create the blocks
	* 
	* Seperate the sanitized text into 4 x 4 blocks. If the string
	* is not evenly divisable by 16 the remainders will be padded
	* with nulls. For future purposes a null holds the numerical
	* value of 0 just like 'A'
	*
	* @var blocks 		an Array that will hold the 4 x 4 blocks 
	*			from the sanitized String text. This Array 
	*			is pushed values of the Array rows
	*
	* @var rows 		an Array that will hold 4 rows of data 
	*			that is pushed from the letters Array
	*
	* @var letters		an Array that will hold the index of the  
	*			alphabet Array based on the substring of the 
	*			sanitized text String
	*
	* @var blockRounds	an Integer with a ceil value of text.length
	*			divided by 16
	*
	* @var letterCount	an Integer that will track the letter position
	*			of the sanitized text String
	*/

	var blocks = new Array();
	var blockRounds = Math.ceil(text.length / 16);
	var letterCount = 0;

	while (blocks.length < blockRounds) {
		var rows = new Array();

		while (rows.length < 4) {
			var letters = new Array();

			while (letters.length < 4) {
				var letter = text.substr(letterCount, 1);
				letters.push((letter !== "") ? alphabet.indexOf(letter) : null);
				letterCount++;
			}

			rows.push(letters);
		}

		blocks.push(rows);
	}

	/**
	* Compression Round 2: Sum of Rows & Row Shifting
	*
	* This round of compression sums the columns of each block and adds
	* a modulus 26 of the sum to the hash total Array and then modulus 26  
	* the hash total. Next, each row of every block is shifted as follows:  
	* The first row shifts one left, the second row shifts two left, the  
	* third row shifts three left and the last row is reversed. The sums  
	* of the columns of each shifted block are modulus 26 and added to the 
	* running total.
	*
	* @var total	an Array with 4 columns that holds the running total
	*		of each block. The value of total is reset to 0, 0, 0, 0
	*		before each block's columns are summed	
	*/

	for (var i = 0; i < blocks.length; i++) {
		var total = new Array(0, 0, 0, 0);

		for (var j = 0; j < blocks[i].length; j++) {
			/* Cycle through the columns and get their sum */
			for (var k = 0; k < blocks[i][j].length; k++) {
				total[k] += blocks[i][j][k];
			}
		}

		/* 
		* Psudeo Arithmetic for adding up columns
		*
		* (COLUMN_1_SUM % 26, COLUMN_2_SUM % 26, COLUMN_3_SUM % 26, COLUMN_4_SUM % 26)  PLUS
		* (RUN_TOTAL_1_SUM, RUN_TOTAL_2_SUM, RUN_TOTAL_3_SUM, RUN_TOTAL_4_SUM)		EQUALS
		* (SUM_COL_1_SUM % 26, SUM_COL_2_SUM % 26, SUM_COL_3_SUM % 26, SUM_COL_4_SUM % 26)	
		*/			
		for (var j = 0; j < 4; j++) {
			hash[j] = (((total[j] % 26) + hash[j]) % 26);
		}

		var total = new Array(0, 0, 0, 0);

		for (var j = 0; j < blocks[i].length; j++) {
			/* Shift blocks switch */
			switch (j) {
				/* Shift left 1 */
				case 0:
					blocks[i][j].push(blocks[i][j].shift());
				break;

				/* Shift left 2 */
				case 1:
					blocks[i][j].push(blocks[i][j].shift());
					blocks[i][j].push(blocks[i][j].shift());
				break;

				/* Shift left 3 */
				case 2:
					blocks[i][j].push(blocks[i][j].shift());
					blocks[i][j].push(blocks[i][j].shift());
					blocks[i][j].push(blocks[i][j].shift());
				break;

				/* Reverse */
				case 3:
					blocks[i][j].reverse();
				break;
			}

			/* Cycle through the columns and get their sum */
			for (var k = 0; k < blocks[i][j].length; k++) {
				total[k] += blocks[i][j][k];
			}
		}

		/* 
		* Psudeo Arithmetic for adding up columns
		*
		* (COLUMN_1_SUM % 26, COLUMN_2_SUM % 26, COLUMN_3_SUM % 26, COLUMN_4_SUM % 26)  PLUS
		* (RUN_TOTAL_1_SUM, RUN_TOTAL_2_SUM, RUN_TOTAL_3_SUM, RUN_TOTAL_4_SUM)		EQUALS
		* (SUM_COL_1_SUM % 26, SUM_COL_2_SUM % 26, SUM_COL_3_SUM % 26, SUM_COL_4_SUM % 26)	
		*/	

		for (var j = 0; j < 4; j++) {
			hash[j] = (((total[j] % 26) + hash[j]) % 26);
		}
	}

	/**
	* Alphanumeric Replacement
	*
	* Replace the Integer with the representative letter with the
	* alphabet Array
	*/

	for (var i = 0; i < 4; i++) {
		hash[i] = alphabet[hash[i]];
	}

	/* Join the hash Array into a String with no seperator */
	return hash.join("");
}