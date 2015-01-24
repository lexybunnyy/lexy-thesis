#include "calculator.h"

using namespace std;

typedef vector<vector<double> > DMatrix;
typedef vector<double> DArray;

/*
Számítsok eredményeinek ellenőrzése
* Minta tesztekkel
* Standard input-ra való kiiratással
*/

//-----------------------------------------------------------------------
/** @name Tesztelő és Teszt generáló függvények*/
//@{
	// Interpoláció tesztek lefuttatása
	void testInterpolation();
	// Newton számítás tesztje
	bool testNewton(bool logPoly);
	// Lagrange Interpoláció tesztje
	bool testLagrange(bool logPoly);
	// Polinom tesztje
	void testPolinomial();
	// Interpolációs Mátrix tesztje
	void testMatrixInterpolation();
	// Manuális Interpolációs teszt
	void testManualInterpolation();
	// Manuális Polinom tesztelő 
	void testManualPolynomial();

	/** generál egy minta X,Y ponthalmazt az x^2 pontjaiból */
	//testMatrixInterpolation Segédfüggvénye
	//feltölti az x*2 pontjaival 
	void genXSquaredPoints(DArray &X, DMatrix &Y);
//@}

/** @name Teszteléshez, teszt írásához és program javításhoz használt segédfüggvények */
//@{
	/** Két Tömb egyezésének ellenőrzése */
	bool checkEqual(DArray one, DArray two);

	/** @name Kiirató függvények */
	//@{
		/** Polinom alakban jelenít meg egy Vector-t
		    Ez kompatibilis a tényleges számítással.
		    (WolframAlpha-ba egyszerűen bemásolható) */
		void logPolynomial(DArray P, string poliName);
		/** Kiírja egymás után egy Vector elemeit a képernyőre */
		void logVector(DArray P, string vectorName);
		/** Kiírja az Interpolációs Mátrix és az X eredményét */
		void logResult(DArray x, DMatrix M);
		/** Kiírja az Interpolációs Mátrix számítási logikájának egy részletét */
		void logCalculate(int i, int j, DMatrix M, DArray x);
	//@}

	/** @name Manuális bekérő függvények */
	//@{
		/** Vektor (Polinom, Ponthalmaz)*/
		void getVectorStd(DArray &P, string poliName);
		/** Pontok Newton-hoz (X és a kezdő mátrix Y pontjai)*/
		void getPointsStd(DArray &x, DMatrix &M);
	//@}
//@}
